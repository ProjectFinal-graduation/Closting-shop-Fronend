export const setString = (key, value) => {
    localStorage.setItem(key, (value))
}

export const getString = key => {
    return (localStorage.getItem(key));
}

export const setJson = (key, value) => {
    localStorage.setItem(key, (JSON.stringify(value)))
}

export const getJson = key => {
    return (JSON.parse(localStorage.getItem(key && key)));
}