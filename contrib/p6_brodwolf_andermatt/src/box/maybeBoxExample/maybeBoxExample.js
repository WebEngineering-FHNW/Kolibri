import {maybeNotNullAndUndefined} from "../../maybe/maybe";
import {chainMaybe, foldMaybe} from "../box";

const openSite = () =>{
    if(current_user){
        return renderPage(current_user);
    } else {
        return showLogin()
    }
}
const openSite = () =>
    eitherNotNullAndUndefined(current_user)
    (_ => showLogin())
    (_ => renderPage(current_user))

const gerPrefs = user => {
    if(user.premium){
        return loadPrefs(user.preferences)
    } else {
        return defaultPrefs
    }
}
const getPrefs = user =>
    eitherTruthy(user.premium)
    (_ => defaultPrefs)
    (_ => Box(user.premium)
            (mapf)(u => u.preferences)
            (fold)(prefs => loadPrefs(prefs))
    )


const streetName = user => {
    if (user){
        const address = user.address;
        if(address){
            const street = address.street;
            if(street){
                const name = street.name;
                if (name){
                    return name.toUpperCase();
                }
            }
        }
    }
    return "no street"
}


const streetName = user =>
    Box(maybeNotNullAndUndefined(user))
        (chainMaybe)(u => maybeNotNullAndUndefined(u.address))
        (chainMaybe)(a => maybeNotNullAndUndefined(a.street))
        (chainMaybe)(s => maybeNotNullAndUndefined(s.name))
        (foldMaybe)(n => n.toUpperCase())
    (_ => "no street")
    (id)

const user = {
    firstName: "Donald",
    lastName: "Duck",
    address: {
        city: "Entenhausen",
        street: {
            name: "WaltStreet",
            nr: 10
        }
    }
}


const concatUniq = (x, ys) => {
    const found = ys.filter(y => y === x)[0]
    return found ? ys : ys.concat(x)
}

const parseDbUrl = cfg => {
    try{
        const c = JSON.parse(cfg);
        if(c.url){
            return c.url.match("/???")
        }
    }catch (e){
        return null
    }
}

const parseDbUrl = cfg =>
    tryCatch(() => Box(cfg)
                    (mapf)(JSON.parse)
                    (mapf)(c => maybeNotNullAndUndefined(c.url))
                    (foldMaybe)(id)
    )
    (_ => null)
    (u => u.match("/salkfjasldkjf"))
