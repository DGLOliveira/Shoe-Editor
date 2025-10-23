export default class urlController {

    // Runs on page load
    get() {
        let params = new URLSearchParams(window.location.search)
        let paramObj : {[key: string]: string} = {}
        for(const [key, value] of params) {
            paramObj[key] = value
        }
        return paramObj
    }

    // Updates URL with new values and pushes to history
    update(
        model : {[key: string]: string},
        colors : {[key: string]: string}, 
        extras : {[key: string]: boolean}) 
        {
        let params = new URLSearchParams(window.location.search)
        //Clear all keys
        for( const [key, _value] of params) {
            params.delete(key)
        }
        //Create new URL
        params.set('Category', model.Category);
        params.set('Name', model.Name);
        Object.keys(colors).map((name) => {
            params.set(name, colors[name])
        })
        Object.keys(extras).map((name) => {
            params.set(name, (extras[name]) ? "true" : "false")
        })
        window.history.pushState({}, '', `?${params.toString()}`)
    }
    
}
