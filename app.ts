let elem = document.querySelector('#table-body')! as HTMLElement;
const companiesSite = "http://localhost:4000/companies";
const usersSite = "http://localhost:4000/users";
let table = "";
let units = 0 ; //start unit
const sortedCompanies: Promise<Companies> = loadAll();
sortedCompanies.then(el => renderCompany(el, units));

async function loadAll() {
    const user: Users          = await fetch(usersSite).then(res => res.json());
    const companies: Companies = await fetch(companiesSite).then(res => res.json());

    return sortCompanyById(user,companies);
}

type Users =  Array<{name:string, email: string, uris: {company: string}}>;
type Companies = Array< {name: string, uri: string,  usersAmount?: number, users?: Users}>;

function sortCompanyById(users: Users, companies: Companies ): Companies{
    let uri;
    let sortedCompaniesAddedUsers;
    companies.map(company => {
        company.usersAmount = 0;
        company.users;
    });
    companies.forEach( company => {
        uri = company.uri;
        sortedCompaniesAddedUsers = users.filter(company => company.uris.company === uri);
        company.usersAmount = sortedCompaniesAddedUsers.length;
        company.users = sortedCompaniesAddedUsers;
    });
    companies.sort((a, b) => a.usersAmount - b.usersAmount);
    return companies;
}

function renderCompany(srtCompanies: Companies, limit: number): void {
    for (let i = limit; i < limit + 10; i++) {
        let company = srtCompanies[i];
        table += `<tr id="${company.uri}"><td>${company.name}</td><td class="td_weight">${company.usersAmount}</td>
                  <td><button id="${company.uri}but" class="btn btn-light" 
                  onclick="showUsers('${company.uri}', ${company.usersAmount}, ${company.usersAmount})" >
                  Show users</button></td></tr>`;
        company.users.forEach( (us) =>{
                table += `<tr style="display: none"><td>${us.name}</td><td>${us.email}</td><td></td></tr>`
            }
        )
    }
    elem.insertAdjacentHTML('beforeend', table)
}
function nextPage(): void{
    if(units < 989) {
        units += 10;
        table = "";
        elem.innerHTML="";
        sortedCompanies.then(el => renderCompany(el, units))
    }
}
function prevPage(): void{
    if(units > 9){
        units -= 10;
        table = "";
        elem.innerHTML="";
        sortedCompanies.then(el => renderCompany(el, units))
    }
}
function showUsers(uri: string, users: number) {
    let displayedCompany = (document.getElementById(`${uri}`)! as HTMLElement).nextElementSibling;
    if (users > 0) {
        if (displayedCompany instanceof HTMLElement && displayedCompany.style.display === 'none')
            for(let i=0; i < users; i++){
                displayedCompany.setAttribute("style", "display:''");
                displayedCompany = displayedCompany.nextElementSibling;
            } else {
            for(let i=0; i < users; i++){
                displayedCompany.setAttribute("style", "display:none");
                displayedCompany = displayedCompany.nextElementSibling;
            }
        }
    }
}






