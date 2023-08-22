import * as actiontypes from "../Actions/actionTypes";

const initialState = {
    error: "",
    contacts: [],
    addcontactopen: false,
    selectedcontact: null,
    loadmsgs: false,
    scrollto: "1",
};

const contactsreducer = (state = initialState, action) => {
    if (action.type === actiontypes.ADDCONTACTOPEN) {
        return { ...state, error: "", addcontactopen: true };
    } else if (action.type === actiontypes.ADDCONTACTCLOSE) {
        return { ...state, error: "", addcontactopen: false };
    } else if (action.type === actiontypes.ADDCONTACTERROR) {
        return { ...state, error: action.error };
    } else if (action.type === actiontypes.GETCONTACTS) {
        return { ...state, contacts: action.contacts };
    } else if (action.type === actiontypes.SELECTCONTACT) {
        const el = state.contacts.find((contact) => contact._id == action._id);
        return {
            ...state,
            selectedcontact: el,
            scrollto: new Date().getTime().toString(),
        };
    } else if (action.type === actiontypes.ADDCONTACTSUCCESS) {
        return {
            ...state,
            contacts: [
                ...state.contacts,
                { ...action.contact, type: "contact" },
            ],
        };
    } else if (action.type === actiontypes.RECIEVEMESSAGE) {
        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id === action.msg.senderid
        ) {
            newselectedcontact = {
                ...state.selectedcontact,
                messages: [...state.selectedcontact.messages, action.msg],
            };
        }
        let cidx = -1;
        for (let i = 0; i < state.contacts.length; i++) {
            if (state.contacts[i]._id === action.msg.senderid) {
                cidx = i;
                break;
            }
        }
        let newcontacts = null;
        if (cidx == -1) {
            newcontacts = [
                {
                    _id: action.msg.senderid,
                    name: "",
                    imgUrl: action.msg.senderimg,
                    about: action.msg.senderabout,
                    mobileno: action.msg.sendermob,
                    messages: [action.msg],
                    type: "contact",
                },
                ...state.contacts,
            ];
        } else {
            let fcon = {
                ...state.contacts[cidx],
                messages: [...state.contacts[cidx].messages, action.msg],
            };
            newcontacts = [...state.contacts];
            newcontacts.splice(cidx, 1);
            newcontacts.unshift(fcon);
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        }
    } else if (action.type === actiontypes.SENDMESSAGE) {
        let newselectedcontact;
        if (state.selectedcontact._id.toString() === action.id) {
            newselectedcontact = {
                ...state.selectedcontact,
                messages: [...state.selectedcontact.messages, action.msg],
            };
        } else {
            newselectedcontact = { ...state.selectedcontact };
        }
        let cidx = -1;
        for (let i = 0; i < state.contacts.length; i++) {
            if (state.contacts[i]._id === action.id) {
                cidx = i;
                break;
            }
        }
        const newcontacts = [...state.contacts];
        newcontacts.splice(cidx, 1);
        newcontacts.unshift(newselectedcontact);
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
            scrollto: new Date().getTime().toString(),
        };
    } else if (action.type === actiontypes.FETCHMESSAGESSTART) {
        return { ...state, loadmsgs: true };
    } else if (action.type === actiontypes.FETCHMESSAGES) {
        let hasmore = true;
        if (action.data.msgs.length === 0) {
            hasmore = false;
        }
        const newcontacts = state.contacts.map((contact) => {
            if (contact._id === action.data.contactid) {
                const newcontact = {
                    ...contact,
                    msgsfetched: true,
                    messages: [...action.data.msgs, ...contact.messages],
                    hasmore: hasmore,
                };
                return newcontact;
            } else {
                return contact;
            }
        });
        if (state.selectedcontact._id === action.data.contactid) {
            const newselectedcontact = {
                ...state.selectedcontact,
                msgsfetched: true,
                messages: [
                    ...action.data.msgs,
                    ...state.selectedcontact.messages,
                ],
                hasmore: hasmore,
            };
            let newscrollto = state.scrollto;
            if (state.selectedcontact.messages.length === 0)
                newscrollto = new Date().getTime().toString();
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
                loadmsgs: false,
                scrollto: newscrollto,
            };
        } else {
            let newscrollto = state.scrollto;
            if (state.selectedcontact.messages.length === 0)
                newscrollto = new Date().getTime().toString();
            return {
                ...state,
                contacts: newcontacts,
                loadmsgs: false,
                scrollto: newscrollto,
            };
        }
    } else if (action.type === actiontypes.DELETECONTACT) {
        const newcontacts = [...state.contacts];
        const idx = newcontacts.findIndex(
            (c) => c._id.toString() === action.id
        );
        newcontacts.splice(idx, 1);
        let newselectedcontact = state.selectedcontact;
        if (state.selectedcontact._id.toString() === action.id.toString()) {
            newselectedcontact = null;
        }
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
        };
    } else if (action.type === actiontypes.CLEARCHAT) {
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.id.toString()) {
                return { ...c, messages: [] };
            } else {
                return c;
            }
        });
        let newselectedcontact;
        if (state.selectedcontact._id.toString() === action.id.toString()) {
            newselectedcontact = { ...state.selectedcontact, messages: [] };
        } else {
            newselectedcontact = { ...state.selectedcontact };
        }
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
        };
    } else if (action.type === actiontypes.EDITCONTACT) {
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.id.toString()) {
                return { ...c, name: action.name };
            } else {
                return c;
            }
        });
        let newselectedcontact;
        if (state.selectedcontact._id.toString() === action.id.toString()) {
            newselectedcontact = {
                ...state.selectedcontact,
                name: action.name,
            };
        } else {
            newselectedcontact = { ...state.selectedcontact };
        }
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
        };
    } else if (action.type === actiontypes.DELETEMESSAGE) {
        const newselectedcontact = {
            ...state.selectedcontact,
            messages: [...state.selectedcontact.messages],
        };
        const idx = newselectedcontact.messages.findIndex(
            (m) => m._id.toString() === action.id.toString()
        );
        newselectedcontact.messages.splice(idx, 1);
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === newselectedcontact._id.toString()) {
                return newselectedcontact;
            } else {
                return c;
            }
        });
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
        };
    } else if (action.type === actiontypes.SENDMEDIASTART) {
        let newselectedcontact;
        if (state.selectedcontact._id.toString() === action.id) {
            newselectedcontact = {
                ...state.selectedcontact,
                messages: [...state.selectedcontact.messages, action.msg],
            };
        } else {
            newselectedcontact = { ...state.selectedcontact };
        }
        let cidx = -1;
        for (let i = 0; i < state.contacts.length; i++) {
            if (state.contacts[i]._id === action.id) {
                cidx = i;
                break;
            }
        }
        const newcontacts = [...state.contacts];
        newcontacts.splice(cidx, 1);
        newcontacts.unshift(newselectedcontact);
        return {
            ...state,
            contacts: newcontacts,
            selectedcontact: newselectedcontact,
            scrollto: new Date().getTime().toString(),
        };
    } else if (action.type === actiontypes.SENDMEDIASUCCESS) {
        const con = state.contacts.find(
            (c) => c._id.toString() === action.id.toString()
        );
        const newmessages = con.messages.map((m) => {
            if (m._id.toString() === action.msgid.toString()) {
                return {
                    ...m,
                    progress: "complete",
                };
            } else {
                return m;
            }
        });
        const newcon = { ...con, messages: newmessages };
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.id.toString()) {
                return newcon;
            } else {
                return c;
            }
        });
        if (state.selectedcontact._id.toString() === action.id.toString()) {
            return {
                ...state,
                selectedcontact: newcon,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        }
    } else if (action.type === actiontypes.MEDIAPROGRESSUPDATE) {
        const con = state.contacts.find(
            (c) => c._id.toString() === action.id.toString()
        );
        const newmessages = con.messages.map((m) => {
            if (m._id.toString() === action.msgid.toString()) {
                return { ...m, progress: action.progress };
            } else {
                return m;
            }
        });
        const newcon = { ...con, messages: newmessages };
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.id.toString()) {
                return newcon;
            } else {
                return c;
            }
        });
        if (state.selectedcontact._id.toString() === action.id.toString()) {
            return {
                ...state,
                selectedcontact: newcon,
                contacts: newcontacts,
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
            };
        }
    } else if (action.type === actiontypes.RECIEVEMEDIA) {
        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id === action.msg.senderid
        ) {
            newselectedcontact = {
                ...state.selectedcontact,
                messages: [...state.selectedcontact.messages, action.msg],
            };
        }
        let cidx = -1;
        for (let i = 0; i < state.contacts.length; i++) {
            if (state.contacts[i]._id === action.msg.senderid) {
                cidx = i;
                break;
            }
        }
        let newcontacts = null;
        if (cidx == -1) {
            newcontacts = [
                {
                    _id: action.msg.senderid,
                    mobileno: action.msg.sendermob,
                    name: "",
                    messages: [action.msg],
                },
                ...state.contacts,
            ];
        } else {
            let fcon = {
                ...state.contacts[cidx],
                messages: [...state.contacts[cidx].messages, action.msg],
            };
            newcontacts = [...state.contacts];
            newcontacts.splice(cidx, 1);
            newcontacts.unshift(fcon);
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        }
    } else if (action.type === actiontypes.ADDGROUP) {
        return {
            ...state,
            contacts: [...state.contacts, { ...action.grp, type: "group" }],
        };
    } else if (action.type === actiontypes.RECIEVEGRPMESSAGE) {
        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id === action.msg.groupid
        ) {
            newselectedcontact = {
                ...state.selectedcontact,
                messages: [...state.selectedcontact.messages, action.msg],
            };
        }
        let cidx = -1;
        for (let i = 0; i < state.contacts.length; i++) {
            if (state.contacts[i]._id === action.msg.groupid) {
                cidx = i;
                break;
            }
        }
        let newcontacts = null;
        let fcon = {
            ...state.contacts[cidx],
            messages: [...state.contacts[cidx].messages, action.msg],
        };
        newcontacts = [...state.contacts];
        newcontacts.splice(cidx, 1);
        newcontacts.unshift(fcon);
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
                scrollto: new Date().getTime().toString(),
            };
        }
    } else if (action.type === actiontypes.REMOVEGRPMEMBER) {
        console.log("in removemember controller");
        let newselectedcontact = null;
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.groupid.toString()) {
                const newmembers = [...c.members];
                const idx = newmembers.findIndex(
                    (mem) =>
                        mem.member._id.toString() === action.member.toString()
                );
                newmembers.splice(idx, 1);
                const newc = { ...c, members: newmembers };
                return newc;
            } else {
                return c;
            }
        });
        if (
            state.selectedcontact &&
            state.selectedcontact._id.toString() === action.groupid.toString()
        ) {
            const newmembers = [...state.selectedcontact.members];
            const idx = newmembers.findIndex(
                (mem) => mem.member._id.toString() === action.member.toString()
            );
            newmembers.splice(idx, 1);
            newselectedcontact = {
                ...state.selectedcontact,
                members: newmembers,
            };
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
            };
        }
    } else if (action.type === actiontypes.DISMISSADMIN) {
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.groupid.toString()) {
                const newmembers = c.members.map((mem) => {
                    if (
                        mem.member._id.toString() === action.member.toString()
                    ) {
                        return { ...mem, role: "participant" };
                    }
                    return mem;
                });
                const newc = { ...c, members: newmembers };
                return newc;
            } else {
                return c;
            }
        });
        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id.toString() === action.groupid.toString()
        ) {
            const newmembers = state.selectedcontact.members.map((mem) => {
                if (mem.member._id.toString() === action.member.toString()) {
                    return { ...mem, role: "participant" };
                }
                return mem;
            });
            newselectedcontact = {
                ...state.selectedcontact,
                members: newmembers,
            };
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
            };
        }
    } else if (action.type === actiontypes.MAKEADMIN) {
        console.log("in make admin redc");
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.groupid.toString()) {
                const newmembers = c.members.map((mem) => {
                    if (
                        mem.member._id.toString() === action.member.toString()
                    ) {
                        return { ...mem, role: "admin" };
                    }
                    return mem;
                });
                const newc = { ...c, members: newmembers };
                return newc;
            } else {
                return c;
            }
        });
        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id.toString() === action.groupid.toString()
        ) {
            const newmembers = state.selectedcontact.members.map((mem) => {
                if (mem.member._id.toString() === action.member.toString()) {
                    return { ...mem, role: "admin" };
                }
                return mem;
            });
            newselectedcontact = {
                ...state.selectedcontact,
                members: newmembers,
            };
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
            };
        }
    } else if (action.type === actiontypes.UPDATEGROUPINFO) {
        const newcontacts = state.contacts.map((c) => {
            if (c._id.toString() === action.data.id.toString()) {
                if (action.data.field === "name") {
                    return { ...c, name: action.data.name };
                } else if (action.data.field === "description") {
                    return { ...c, description: action.data.description };
                } else if (action.data.field === "image") {
                    return { ...c, imgUrl: action.data.imgUrl };
                }
            }
            return c;
        });

        let newselectedcontact = null;
        if (
            state.selectedcontact &&
            state.selectedcontact._id.toString() === action.data.id.toString()
        ) {
            if (action.data.field === "name") {
                newselectedcontact = {
                    ...state.selectedcontact,
                    name: action.data.name,
                };
            } else if (action.data.field === "description") {
                newselectedcontact = {
                    ...state.selectedcontact,
                    description: action.data.description,
                };
            } else if (action.data.field === "image") {
                newselectedcontact = {
                    ...state.selectedcontact,
                    imgUrl: action.data.imgUrl,
                };
            }
        }
        if (newselectedcontact) {
            return {
                ...state,
                selectedcontact: newselectedcontact,
                contacts: newcontacts,
            };
        } else {
            return {
                ...state,
                contacts: newcontacts,
            };
        }
    }
    return state;
};

export default contactsreducer;
