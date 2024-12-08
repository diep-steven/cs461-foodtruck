console.log("test");

const trucknameIn = document.getElementById("truckName");
const addressIn = document.getElementById("address");
const phoneNumIn = document.getElementById("phoneNum");
const extLinkIn = document.getElementById("externalLink");
const descriptionIn = document.getElementById("description");

const daysOfWeek = ["mon", "tues", "wed", "thur", "fri", "sat", "sun"];

// daysOfWeek.forEach((day) => {
//     console.log(document.getElementById(`${day}Open`))
//     console.log(document.getElementById(`${day}Close`))
// });



const submit = document.getElementById("submit");
submit.addEventListener("click", addTruck);

function addTruck() {
    console.log("submit");
    const payload = {
        truckname: trucknameIn.value,
        address: addressIn.value,
        phoneNumber: phoneNumIn.value,
        description: descriptionIn.value,
        externalLink: extLinkIn.value,
    }

    daysOfWeek.forEach((day) => {
        // console.log(day)
        // console.log(document.getElementById(day + "Open").value)
        // console.log(document.getElementById(day + "Close").value)
        const checkedBox = document.getElementById(day + "Closed");

        let hourOpenVal = document.getElementById(day + "Open").value;
        let hourCloseVal = document.getElementById(day + "Close").value;


        if(checkedBox.checked) {
            payload[day + "Closed"] = true;
            payload[day + "Open"] = null;
            payload[day + "Close"] = null;
        } else {
            payload[day + "Closed"] = false;
            payload[day + "Open"] = hourOpenVal;
            payload[day + "Close"] = hourCloseVal;
        }
    
    });

    console.log(payload);
}