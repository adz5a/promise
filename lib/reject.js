/**
 * Created by obiwankenobi on 11/08/2015.
 */
/**
 *
 * @param {Promise} promise
 * @param reason
 */
function reject ( promise, reason ) {

    if ( promise.state === VALID_STATES.PENDING ) {
        promise.state = VALID_STATES.REJECTED;

    }

    return promise;
}

module.exports = reject;