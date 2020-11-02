
const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEX56eJhYJKwYBBAHaRw8BAQdAmbmhyCyvrw75dv21uTA/Brg9WZtNqdNwx3Fn
xDlfMOW0JlBpb3RyIENob2N6eW5za2kgPHBpb3RyQGNob2N6eW5za2kucGw+iJYE
ExYIAD4WIQTym3UjvEWZibYn5dOJQs1+4ZLlawUCX56eJgIbAwUJCbZkCgULCQgH
AgYVCgkICwIEFgIDAQIeAQIXgAAKCRCJQs1+4ZLla/MXAP42QYUVFY+bPhNcrxk7
raX8rdTj9zh7igIBMQCX6bpcfQEAsVW5iy8VVzjXZixZeT2DKzaFikwxxIaiJ3Vv
sV6UaAG4OARfnp4mEgorBgEEAZdVAQUBAQdAvW8etSFjCZpIfcI7iEj8cgF1ppde
i/seflIrRJWoBCsDAQgHiH4EGBYIACYWIQTym3UjvEWZibYn5dOJQs1+4ZLlawUC
X56eJgIbDAUJCbZkCgAKCRCJQs1+4ZLla6/pAQDAIKfPGsMd8wnDyAclhAMK7fdX
Q81ea2UrVXQDYrhi9QEA5Cmjr7zNbnOAhmAJPCg8Wvl596e123wdOTfRCsm6WQs=
=FzRU
-----END PGP PUBLIC KEY BLOCK-----`;

async function encryptWithPublicKey(message) {
    if (window.crypto.getRandomValues) {
        const { data: encrypted } = await openpgp.encrypt({
            message: openpgp.message.fromText(message),
            publicKeys: (await openpgp.key.readArmored(publicKey)).keys
        });

        // document.getElementById("encrypted-message").innerHTML = encrypted;
        // document.getElementById("encrypted-message-title").innerHTML = "Message content encrypted with my public key:";

        return encrypted;
    } else {
        window.alert("This browser isn't supported!");
        return false;
    }
}