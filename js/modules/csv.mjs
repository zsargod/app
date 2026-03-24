export default csv => {
    let rows = csv.split(/\r?\n/).filter(d => d.length).map(d => d.split(','));
    let headers = rows.shift();
    let records = [];

    rows.forEach(d => {
        let record = {};

        headers.forEach((h, i) => {
            record[h] = d[i];
        });

        records.push(record);
    });

    return {
        headers,
        rows,
        records
    };
};