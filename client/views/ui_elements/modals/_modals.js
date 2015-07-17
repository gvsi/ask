Template.uiModals.rendered = function (){
    $('#btnToggleSlideUpSize').click(function() {
        var size = $('input[name=slideup_toggler]:checked').val()
        var modalElem = $('#modalSlideUp');
        if (size == "mini") {
            $('#modalSlideUpSmall').modal('show')
        } else {
            $('#modalSlideUp').modal('show')
            if (size == "default") {
                modalElem.children('.modal-dialog').removeClass('modal-lg');
            } else if (size == "full") {
                modalElem.children('.modal-dialog').addClass('modal-lg');
            }
        }
    });

    $('#btnStickUpSizeToggler').click(function() {
        var size = $('input[name=stickup_toggler]:checked').val()
        var modalElem = $('#myModal');
        if (size == "mini") {
            $('#modalStickUpSmall').modal('show')
        } else {
            $('#myModal').modal('show')
            if (size == "default") {
                modalElem.children('.modal-dialog').removeClass('modal-lg');
            } else if (size == "full") {
                modalElem.children('.modal-dialog').addClass('modal-lg');
            }
        }
    });

    // Only for fillin modals so that the backdrop action is still there
    $('#modalFillIn').on('show.bs.modal', function(e) {
        $('body').addClass('fill-in-modal');
    })
    $('#modalFillIn').on('hidden.bs.modal', function(e) {
        $('body').removeClass('fill-in-modal');
    })
};