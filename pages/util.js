function activateRotation (object){
    object.rotation = true;
    return object;
}

function activateTranslation (object){
    object.translation = true;
    return object;
}

module.exports = {
    activateRotation,
    activateTranslation
}