


export const state = () => ({
    list: [],
    alert: {
        value: false,
        message: ""
    }
})

export const mutations = {
    add(state, text) {
        state.list.push({
            text,
            done: false
        })
    },
    remove(state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1)
    },
    alert(state, newAlert) {
        state.alert = newAlert;
    }
}