const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEYaPBgRYJKwYBBAHaRw8BAQdAc7aXCzy/QUmW+Yny7LXzKxNi4rBx18RPEYoT
Qbp06RW0J1Bpb3RyIENob2N6ecWEc2tpIDxwaW90ckBjaG9jenluc2tpLnBsPoiQ
BBMWCAA4FiEEq7bmnI+M1uKRfEbsl6tbwhMbDLYFAmGjwYECGwMFCwkIBwIGFQoJ
CAsCBBYCAwECHgECF4AACgkQl6tbwhMbDLZvQgD/ZTTKK/1piD+g68UXUR++tvlH
8bbzNW9lTQwK8Eaj+z0BALBCF2F1LA4+hRtds1fHoFKVSuzD3s6yWRPhaL9gROMK
uDgEYaPBgRIKKwYBBAGXVQEFAQEHQLuxJsE3jt4mMNPSiAz7Lk/GdCp7i9aUXc/H
RkNu4zVUAwEIB4h4BBgWCAAgFiEEq7bmnI+M1uKRfEbsl6tbwhMbDLYFAmGjwYEC
GwwACgkQl6tbwhMbDLaPewEA+/G7rZc9Yckae+R0LHAnVtAdT/vhU2vBFQOn72di
XGEA/jaqskkyjefSUYhQsAPOiPzjcf92zPU0+cNBaWV/dWgF
=jNZk
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