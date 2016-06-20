(function(window){

    var Blocker = {
        isCurrencyPage: false,
        usersBlocked: [],
        init: function() {
            this.checkPage()
            this.hideBlockedUsers();
            this.allWhispers();
        },
        checkPage: function() {
            var host = window.location.host;
            this.isCurrencyPage = host.indexOf('currency') > -1
        },
        hideBlockedUsers: function() {
            var self = this;

            chrome.storage.sync.get(['blocked-sellers'], function (blockedSellers) {
                var results = blockedSellers['blocked-sellers'] ? blockedSellers['blocked-sellers'] : []; 
                self.usersBlocked = results;

                _.each(self.usersBlocked, function(seller){
                    self.hideUser(seller);
                });
            });
        },
        allWhispers: function() {
            var self = this;
            var sellers = this.isCurrencyPage ? $('.displayoffer-bottom span.right a') : $('.whisper-btn');

            _.each(sellers, function(seller){
                self.appendBlockButton(seller);
            });
        },
        appendBlockButton: function(el) {
            var btn = '<span class="block-seller-wrapper"><a class="block-seller" href="#">Block</a></span>'
            $(el).after(btn);
        },
        blockUser: function(user) {
            this.usersBlocked.push(user);

            var jsonObj = {};
            jsonObj['blocked-sellers'] = this.usersBlocked;

            chrome.storage.sync.set(jsonObj);
            this.hideUser(user);
        },
        hideUser: function(user) {
            if(this.isCurrencyPage) {
                $('.displayoffer[data-ign="'+user+'"]').hide()
            } else {
                $('.search-results tbody[data-ign="'+user+'"]').hide()
            }
        }
    }

    $(document).on('click', '.block-seller', function(e){
        e.preventDefault();
        var ign = Blocker.isCurrencyPage ? $(this).parents('.displayoffer').data('ign') : $(this).parents('tbody').data('ign');

        if(ign) {
            if(confirm('Block this seller?')) {
                Blocker.blockUser(ign);
            }            
        }
    });

    $(document).ready(function(){
        Blocker.init()
    });

})(window)