let currentId = 0;

/** Get element Uid
 * @param {string} type
 * @param {*} obj
 */
function getUid(type: any, obj: any) {
    let id = (type || "default") + "-" + ++currentId;
    if (obj) {
        if (obj._uid) {
            return obj._uid;
        }
        if (obj.getAttribute && obj.getAttribute("id")) {
            return obj.getAttribute("id");
        }
        // @ts-expect-error TS(2339): Property 'id' does not exist on type 'Window'.
        if (parent.id) {
            // @ts-expect-error TS(2339): Property 'id' does not exist on type 'Window'.
            return parent.id;
        }
        if (obj.setAttribute) {
            obj.setAttribute("id", id);
        } else {
            obj._uid = id;
        }
    }
    return id;
}

export default getUid;
