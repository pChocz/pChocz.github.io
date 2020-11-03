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

const userId = "user_qaQ17eik2olmLaxxDvrFM";
const serviceId = "service_3mvw89q";
const templateId = "template_ygdc6ro";

(function () {
    emailjs.init(userId);
})();

(function () {
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        const validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                if (form.checkValidity() === true) {
                    sendEmail();
                    form.classList.remove('was-validated');
                } else {
                    event.stopPropagation();
                    form.classList.add('was-validated');
                }
            }, false);
        });
    }, false);
})();

function sendEmail() {

    document.getElementById('message-sent-status').innerHTML = 'Encrypting and sending message...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message-content').value;

    const messageToSend = 'New message from your website:\n\n' +
        name + '\n' +
        email + '\n' +
        subject + '\n\n' +
        message + '\n';

    encryptWithPublicKey(messageToSend)
        .then(
            encryptedMessage => {
                const templateParams = {
                    message: encryptedMessage
                };

                emailjs.send(serviceId, templateId, templateParams)
                    .then(function (response) {
                        console.log('SUCCESS!', response.status, response.text);
                        document.getElementById('message-sent-status').innerHTML = 'Your message has been sent. Thank you!';
                    }, function (error) {
                        console.log('FAILED...', error);
                        document.getElementById('message-sent-status').innerHTML = 'FAILED';
                    });
            }
        );

    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('subject').value = "";
    document.getElementById('message-content').value = "";
}


async function encryptWithPublicKey(message) {
    if (window.crypto.getRandomValues) {
        const {data: encrypted} = await openpgp.encrypt({
            message: openpgp.message.fromText(message),
            publicKeys: (await openpgp.key.readArmored(publicKey)).keys
        });

        return encrypted;
    } else {
        window.alert("This browser isn't supported!");
        return false;
    }
}