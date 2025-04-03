const GetRequired = (text) => ({
    required: true,
    message: "Please input " + text
})

const checkFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};


export { GetRequired, checkFile };