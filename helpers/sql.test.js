const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
    test("updates a single item", () => {
        const result = sqlForPartialUpdate({ lastName: "Doe" }, { firstName: "John", lastName: "Smith" });
        expect(result).toEqual({ setCols: "\"Smith\"=$1", values: ["Doe"] });
    })

    test("updates multiple items", () => {
        const result = sqlForPartialUpdate({ val1: "I have been changed.", val2: "I am different.", val3: "Proudly different." }, { val1: "Change me.", val2: "I also need to be changed.", val3: "Change me too!", val4: "I should remain the same." });
        expect(result).toEqual({ setCols: "\"Change me.\"=$1, \"I also need to be changed.\"=$2, \"Change me too!\"=$3", values: ['I have been changed.', 'I am different.', 'Proudly different.'] })
    })
})
