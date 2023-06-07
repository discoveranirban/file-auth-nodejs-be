const validateName = (data) => {
    if(!data){
        return false;
    }

    return true;
}

const validateEmail = (data) => {
    if(!data){
        return false;
    }

    return true;
}

const validatePassword = (data) => {
    if(!data){
        return false;
    }

    return true;
}

module.exports = { validateName, validateEmail, validatePassword }