/*******************************************************************************
 * Artifact:    gft.js                                                         *
 * Version:     0.1                                                            *
 * Date:        16/11/2022 21:30:00                                            *
 * Author:      Miguel Angel Gil Rios - angel.grios@gmail.com                  *
 * Comments:    Grios-Filter-Table (gft).                                      *
 *              This code was adapted from:                                    *
 *              https://stackblitz.com/edit/js-xtvtgr?file=index.js            *
 ******************************************************************************/

/**
 * Configure a filterable HTML-Table by associating a text input with a
 * table.
 * @param {input} textField: A HTML-Input element.
 * @param {table} table:     The HTML-Table that will being filtered based on
 *                           the user text field typed input.
 * @returns {undefined}
 */
function configureTableFilter(textField, table)
{
    let rows = table.tBodies[0].rows;
    textField.addEventListener('input', applyFilter);
    function applyFilter(e) 
    {
        let search = e.target.value;

        // get terms to filter on 
        let terms = search.split(/\s+/)
          .filter((x) => x.length > 0) // skip empty terms
          .map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex

        // build pattern/regex
        let pattern = '(' + terms.join('|') + ')';
        let regEx = new RegExp(pattern, 'gi');

        // apply to all rows
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let match = row.textContent.match(regEx);
            row.classList.toggle('hide-row', match == null || 
                                 match.length < terms.length);
        }
    }
}