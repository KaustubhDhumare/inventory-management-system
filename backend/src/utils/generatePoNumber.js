import Counter from "../models/counter.model.js";


const generatePoNumber = async () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2, "0");

    const counterKey = `PO-${year}-${month}`;

    const counter = await Counter.findOneAndUpdate(
        {key: counterKey},
        {$inc: { sequence: 1 }},
        {
            new: true,
            upsert: true,
        },
    );

    const sequence = String(counter.sequence).padStart(3, "0");

    return `PO-${year}-${month}-${sequence}`;
};


export default generatePoNumber;



