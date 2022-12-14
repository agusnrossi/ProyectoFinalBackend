const fs = require("fs")
const path = require("path")
const nodemailer = require('nodemailer')
const handlebars = require("handlebars")
const adminConfig = require('../config/config')
const {adminWppMessage, smsClient} = require('./whatsapp')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: 'proyectofinalcoder@gmail.com',
        pass: 'orzbtldznmpkulan'
    }
});

async function newRegisterNodemailer(newUser){
    try {
        const mailPayload = {
            from: 'ProyectoFinal- Agustin Rossi',
            to: adminConfig.ADMIN_EMAIL,
            subject:`New Register!`,
            html:`
            <html>
                <body>
                    <div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title"> Nombre: ${newUser.name}</h5>
                            <p class="card-text"> Email: ${newUser.email}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"> Direccion: ${newUser.address}</li>
                            <li class="list-group-item"> Carrito ID: ${newUser.cart}</li>
                            <li class="list-group-item">Telefono: ${newUser.phone}</li>
                        </ul>
                    </div>
                </body>
            </html>`,
        };
        await transporter.sendMail(mailPayload);
    } catch (error) {
        throw error
    }
}

async function newPurchaseNodemailer(user,purchase){
    try {
        const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/cartList.hbs"), "utf8")
        const template = handlebars.compile(emailTemplateSource)
        const htmlToSend = template({purchase, user})

        const subjectString = `Nuevo pedido de ${user.name}. Email: ${user.email}`
        const mailPayload = {
            from: 'ProyectoFinal- Agustin Rossi',
            to: adminConfig.ADMIN_EMAIL,
            subject: subjectString,
            html:htmlToSend,
        };
        await transporter.sendMail(mailPayload);
        //await adminWppMessage(subjectString)
        //await smsClient(user.phone, `Hola ${user.name}! Su pedido ha sido recibido y est?? ahora en proceso. Gracias!`)
        return true
    } catch (error) {
        throw error
    }
}


module.exports={newRegisterNodemailer, newPurchaseNodemailer}