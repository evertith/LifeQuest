var Storekit = require('ti.storekit');

/*
 Now let's define a couple utility functions. We'll use these throughout the app.
 */

/**
 * Keeps track (internally) of purchased products.
 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
 */
function markProductAsPurchased(identifier) {
    Ti.App.Properties.setBool('Purchased-' + identifier, true);
}

/**
 * Checks if a product has been purchased in the past, based on our internal memory.
 * @param identifier The identifier of the Ti.Storekit.Product that was purchased.
 */
function checkIfProductPurchased(identifier) {
    return Ti.App.Properties.getBool('Purchased-' + identifier, false);
}

/**
 * Requests a product. Use this to get the information you have set up in iTunesConnect, like the localized name and
 * price for the current user.
 * @param identifier The identifier of the product, as specified in iTunesConnect.
 * @param success A callback function.
 * @return A Ti.Storekit.Product.
 */
function requestProduct(identifier, success) {
    Storekit.requestProducts([identifier], function (evt) {
        if (!evt.success) {
            alert('ERROR: We failed to talk to Apple!');
        }
        else if (evt.invalid) {
            alert('ERROR: We requested an invalid product!');
        }
        else {
        	Ti.API.info('Product was found: ' + evt.products[0].title + ' - ' + evt.products[0].formattedPrice)
            success(evt.products[0]);
        }
    });
}

/**
 * Purchases a product.
 * @param product A Ti.Storekit.Product (hint: use Storekit.requestProducts to get one of these!).
 */
function purchaseProduct(product,data) {
    Storekit.purchase(product, function (evt) {
        switch (evt.state) {
            case Storekit.FAILED:
                alert('ERROR: Buying failed!');
                break;
            case Storekit.PURCHASED:
            case Storekit.RESTORED:
 				Ti.App.fireEvent('showAchievement',{group:'Loots',title:'First In-App Purchase',desc:'You\'re a rockstar!',points:10})
           		switch(data.type){
            		case 'gold':
 						Ti.App.fireEvent('showAchievement',{group:'Loots',title:'First Gold Purchase',desc:'You\'re a rockstar!',points:10})
            			var newGold = parseInt(currentUser.gold) + data.gold;
            			socketInApp.emit('purchaseGold',{email:currentUser.email,gold:newGold})
            			break;
            		case 'xp':
            			Ti.App.fireEvent('showAchievement',{group:'Loots',title:'First Experience Purchase',desc:'You\'re a rockstar!',points:10})
            			socketInApp.emit('purchaseXp',{email:currentUser.email,userXp:currentUser.xp,xpAmount:data.xpAmount,level:currentUser.level})
            			socketUser.emit('updateXp',{email:currentUser.email,userXp:currentUser.xp,xpAmount:data.xpAmount,level:currentUser.level})
            			break;
            	}
            	
                alert('Thank you for your purchase!');
                markProductAsPurchased(product.identifier);
                break;
        }
    });
}

/**
 * Restores any purchases that the current user has made in the past, but we have lost memory of.
 */
function restorePurchases() {
    Storekit.restoreCompletedTransactions();
}
Storekit.addEventListener('restoredCompletedTransactions', function (evt) {
    if (evt.error) {
        alert(evt.error);
    }
    else if (evt.transactions == null || evt.transactions.length == 0) {
        alert('There were no purchases to restore!');
    }
    else {
        for (var i = 0; i < evt.transactions.length; i++) {
            markProductAsPurchased(evt.transactions[i].identifier);
        }
        alert('Restored ' + evt.transactions.length + ' purchases!');
    }
});

/*
 1) Can the user make payments? Their device may be locked down, or this may be a simulator.
 */
if (!Storekit.canMakePayments)
    alert('This device cannot make purchases!');
else {

    /*
     2) Tracking what the user has purchased in the past. RETURNS BOOLEAN
     */
    //'Single Item': checkIfProductPurchased('com.tigerdog.storekittest.testitem2') ? 'Purchased!' : 'Not Yet',
    //'Subscription': checkIfProductPurchased('com.tigerdog.storekittest.gamepack1') ? 'Purchased!' : 'Not Yet'

    /*
     3) Buying a single item.
     */
    requestProduct('com.tigerdog.lifequest.scroll.farsight', function (product) {
            //purchaseProduct(product);
    });

    /*

    /*
     5) Restoring past purchases.
     */
        //restorePurchases();
}

win.open();