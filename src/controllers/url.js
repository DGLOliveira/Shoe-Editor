export default class urlController {

    // Runs on page load
    init() {
    }

    // Updates URL with new values and pushes to history
    // WARNING: Sliding thru color swatch will overflow history and throw error "Insecure operation"
    update(model, colors, extras) {
        let params = new URLSearchParams(window.location.search)
        //Clear all keys
        for( const [key, _value] of params) {
            params.delete(key)
        }
        //Create new URL
        params.set('Category', model.category);
        params.set('Model', model.name);
        Object.keys(colors).map((name) => {
            params.set(name, colors[name])
        })
        Object.keys(extras).map((name) => {
            params.set(name, extras[name])
        })
        window.history.pushState({}, '', `?${params.toString()}`)
    }
    
}
