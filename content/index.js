let jcrop, selection;

const overlay = (() => {
    let active = false;
    return (show) => {
        active = typeof show === 'boolean' ? show : show === null ? active : !active;
        $('.jcrop-holder')[active ? 'show' : 'hide']();
        chrome.runtime.sendMessage({
            message: 'active',
            active
        });
    };
})();

const image = callback => {
    const img = new Image();
    img.id = 'fake-image';
    img.src = chrome.runtime.getURL('/content/pixel.png');
    img.onload = () => {
        $('body').append(img);
        callback();
    };
};

// Create overlay elements for highlighting selected area
const overlays = {
    top: $('<div>').appendTo('body'),
    bottom: $('<div>').appendTo('body'),
    left: $('<div>').appendTo('body'),
    right: $('<div>').appendTo('body')
};

for (let key in overlays) {
    overlays[key].css({
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        display: 'none'
    });
}

const init = callback => {
    $('#fake-image').Jcrop({
        bgColor: 'none',
        onSelect: e => {
            selection = e;
            for (let key in overlays) {
                overlays[key].hide();
            }
            capture();
        },
        onChange: e => {
            selection = e;
            overlays.top.css({
                top: '0',
                left: '0',
                width: '100%',
                height: `${selection.y}px`
            });
            overlays.bottom.css({
                top: `${selection.y + selection.h}px`,
                left: '0',
                width: '100%',
                height: `calc(100% - ${selection.y + selection.h}px)`
            });
            overlays.left.css({
                top: `${selection.y}px`,
                left: '0',
                width: `${selection.x}px`,
                height: `${selection.h}px`
            });
            overlays.right.css({
                top: `${selection.y}px`,
                left: `${selection.x + selection.w}px`,
                width: `calc(100% - ${selection.x + selection.w}px)`,
                height: `${selection.h}px`
            });
            for (let key in overlays) {
                overlays[key].show();
            }
        },
        onRelease: e => {
            setTimeout(() => {
                selection = null;
            }, 100);
        }
    }, function() {
        jcrop = this;
        $('.jcrop-hline, .jcrop-vline').css({
            backgroundImage: `url(${chrome.runtime.getURL('/vendor/Jcrop.gif')})`
        });
        if (selection) {
            jcrop.setSelect([selection.x, selection.y, selection.x2, selection.y2]);
        }
        if (callback) {
            callback();
        }
    });
};

const capture = force => {
    chrome.storage.sync.get(options => {
        if (selection) {
            jcrop.release();
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    message: 'capture',
                    area: selection,
                    dpr: devicePixelRatio
                }, response => {
                    overlay(false);
                    selection = null;
                    if (response.args) {
                        crop(...response.args);
                    }
                });
            }, 50);
        }
    });
};

window.addEventListener('resize', (() => {
    let timeout = null;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            jcrop.destroy();
            init(() => overlay(null));
        }, 100);
    };
})());

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'init') {
        sendResponse({});
        if (jcrop) {
            overlay();
            capture(true);
        } else {
            image(() => init(() => {
                overlay();
                capture();
            }));
        }
    }
    return true;
});
