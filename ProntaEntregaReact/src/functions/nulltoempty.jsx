const NullToEmpty = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj[key] === null) {
            newObj[key] = '';
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            newObj[key] = NullToEmpty(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

export default NullToEmpty;