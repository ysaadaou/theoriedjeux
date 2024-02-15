class NormalFormTable {
    constructor(NbStrsP1, NbStrsP2, container) {
        container.innerHTML = "";
        this.stepsArea = document.createElement('h1');
        this.players = [];
        this.MessageArea = document.createElement('div');
        this.MessageArea.classList.add('MessageArea');
        this.h1 = document.createElement('h1')
        this.h1.textContent = 'Table Normal Forme';
        this.MessageArea.appendChild(this.h1);
        container.appendChild(this.MessageArea);
        this.btn = document.createElement('button');
        this.Matrix;
        
        this.gainsMatrixP1 = [];
        this.gainsMatrixP2 = [];
        this.NbStrsP1 = NbStrsP1;
        this.NbStrsP2 = NbStrsP2;
        this.table = document.createElement('table');
        this.GetInputsTable();
    }

    start() {
        this.btn.textContent = 'Next'
        this.Matrix = this.getData();
        let irm = false;
        let dom;
        let current="";
        this.redraw();
        this.btn.onclick = () => {
            for(let i = 0; i < this.table.rows.length; i++) {
                for(let j = 0; j < this.table.rows[i].cells.length; j++) {
                    this.table.rows[i].cells[j].querySelector('p').style.backgroundColor = "";
                    if(i !== 0 && j !== 0) {
                        let spans = helper.extractNodes(this.table.rows[i].cells[j].querySelector('p'), 'span');
                        spans[0].classList.remove('emph');
                        spans[1].classList.remove('emph');
                    }
                }
            }
            if(irm !== false) {
                this.table.deleteRow(irm+1);
            }
            if(current === 0 && dom !== false) {
                this.table.deleteRow(dom);
            } else if(current === 1 && dom !== false) {
                for(let i = 0; i < this.table.rows.length; i++) {
                        this.table.rows[i].deleteCell(dom+1);
                }
            }
                if(irm = this.checkForDup()) {
                    this.h1.textContent = "Remove duplication";
                    this.Matrix.splice(irm, 1);
                    console.log(this.Matrix);
                }
                else {
                    container.appendChild(this.stepsArea);
                    this.gainsMatrixP1 = [];
                    this.gainsMatrixP2 = [];
                    console.log(this.Matrix)
                    this.Matrix.forEach(row => {
                        let r1 = [];
                        let r2 = [];
                        row.forEach(elem => {
                            r1.push(elem.split(',')[0]);
                            r2.push(elem.split(',')[1]);
                        })
                        this.gainsMatrixP1.push(r1)
                        this.gainsMatrixP2.push(r2)
                    })
                        if(!(dom = this.checkForDominance(0))) {
                            if(dom=this.checkForDominance(1)) {
                                current = 1;
                                dom = dom-1;
                                for(let i = 0; i < this.Matrix.length; i++) {
                                    for(let j = 0; j < this.Matrix[i].length; j++) {
                                        if(j === dom) {
                                            this.Matrix[i].splice(j,1);
                                        }
                                    }
                                }
                            }
                            else {
                                    this.h1.textContent = "The end of the Game";
                                    this.stepsArea.textContent = "";
                                    this.btn.remove();
                            }
                        } 
                        else {
                            current = 0;
                                console.log(dom-1);
                                this.Matrix.splice(dom-1, 1);
                        }
                }
            }
    }

    checkForDominance(playerIndex) {
        this.h1.textContent = `check For Player ${this.players[playerIndex]}`;
        if(playerIndex === 0) {
            return this.check(this.gainsMatrixP1, 0);
        } else {
            return this.check(helper.transpose(this.gainsMatrixP2), 1);
        }

    }


    redraw() {
        for(let i = 0; i < this.table.rows.length; i++) {
            for(let j = 0; j < this.table.rows[i].cells.length; j++) {
                let val = this.table.rows[i].cells[j].querySelector('input').value;
                if(i !== 0 && j !== 0) {
                    let gains = val.split(',');
                    this.table.rows[i].cells[j].innerHTML = `<p><span>${gains[0]}</span>,<span>${gains[1]}</span></p>`;
                }
                else {
                    this.table.rows[i].cells[j].innerHTML = `<p>${val}</p>`;
                }
            }
        }
    }
    check(matrix, player) {
        let colors = ["darkgreen", "darkred"];
        let perms = helper.permutations(matrix.length);
        console.log(perms);
        let nbGreater1 = 0;
        let nbGreater2 = 0;
        for(let i = 0; i < perms.length;i++) {
            nbGreater1=0;
            nbGreater2=0;
            for(let j = 0; j < matrix[perms[i][0]].length; j++) {
                if(parseInt(matrix[perms[i][0]][j]) > parseInt(matrix[perms[i][1]][j])) {
                    ++nbGreater1;
                }
                else if(parseInt(matrix[perms[i][0]][j]) < parseInt(matrix[perms[i][1]][j])) {
                    ++nbGreater2;
                }
            }
            if(nbGreater1 === matrix[perms[i][0]].length) {
                this.stepsArea.textContent = `${matrix[perms[i][1]]}  <  ${matrix[perms[i][0]]}`;
                console.log("perms: ",perms[i], "player " , player)
                this.coloriage(player, perms[i], colors[player], true);
                return perms[i][1] + 1;
            }
            else if(nbGreater2 === matrix[perms[i][1]].length) {
                this.stepsArea.textContent = `${matrix[perms[i][0]]}  <  ${matrix[perms[i][1]]}`;
                console.log("perms: ",perms[i], "player " , colors[player])
                this.coloriage(player, perms[i], colors[player], true);
                return perms[i][0] + 1;
            }
        }
        return false;
    }


    coloriage(player, indexes, color, dup=false, dupl=false) {
        if(player === 0) {
            if(dup) {
                setTimeout(() => {
                    for (let j = 0; j < this.table.rows[indexes[0]+1].cells.length; j++) {
                        if(j !== 0 && !dupl) {
                        let spans1 = helper.extractNodes(this.table.rows[indexes[0]+1].cells[j].querySelector('p'), 'span');
                        let spans2 = helper.extractNodes(this.table.rows[indexes[1]+1].cells[j].querySelector('p'), 'span');
                        spans1[player].classList.add('emph')
                        spans2[player].classList.add('emph')
                        }
                        this.table.rows[indexes[0]+1].cells[j].querySelector('p').style.backgroundColor = color;
                        this.table.rows[indexes[1]+1].cells[j].querySelector('p').style.backgroundColor = color;
                    }
                }, 1000);
            }
            else {
                    for (let j = 0; j < this.table.rows[indexes[0]+1].cells.length; j++) {
                        this.table.rows[indexes[0]+1].cells[j].querySelector('p').style.backgroundColor = color;
                        this.table.rows[indexes[1]+1].cells[j].querySelector('p').style.backgroundColor = color;
                    }
            }

            setTimeout(() => {
                for (let j = 0; j < this.table.rows[indexes[0]+1].cells.length; j++) {
                    this.table.rows[indexes[0]+1].cells[j].querySelector('input').style.backgroundColor = "";
                    this.table.rows[indexes[1]+1].cells[j].querySelector('input').style.backgroundColor = "";
                }

            }, 2000)
        }
        else if(player === 1) {
            if(dup) {
                setTimeout(() => {
                    for (let j = 0; j < this.table.rows.length; j++) {
                        if(j !== 0 && !dupl) {
                            console.log("hey")
                            let spans1 = helper.extractNodes(this.table.rows[j].cells[indexes[0]+1].querySelector('p'), 'span');
                            let spans2 = helper.extractNodes(this.table.rows[j].cells[indexes[1]+1].querySelector('p'), 'span');
                            spans1[player].classList.add('emph')
                            spans2[player].classList.add('emph')
                        }
                        console.log("hello", indexes[0]);
                        console.log("hello", indexes[1]);
                        this.table.rows[j].cells[indexes[0]+1].querySelector('p').style.backgroundColor = color;
                        this.table.rows[j].cells[indexes[1]+1].querySelector('p').style.backgroundColor = color;
                    }

                }, 1000);
                
            }
            else {
                    for (let j = 0; j < this.table.rows.length; j++) {
                        console.log("hello", indexes[0]);
                        console.log("hello", indexes[1]);
                        this.table.rows[j].cells[indexes[0]+1].querySelector('p').style.backgroundColor = color;
                        this.table.rows[j].cells[indexes[1]+1].querySelector('p').style.backgroundColor = color;
                    }

            }

            setTimeout(() => {
                for (let j = 0; j < this.table.rows.length; j++) {
                    this.table.rows[j].cells[indexes[0]+1].querySelector('input').style.backgroundColor = "";
                    this.table.rows[j].cells[indexes[1]+1].querySelector('input').style.backgroundColor = "";
                }

            }, 2000)
            
        }

    }
    checkForDup() {
        let perms = helper.permutations(this.Matrix.length);
        for(let i = 0; i < perms.length;i++) {
            let count = 0;
            for(let j = 0; j < this.Matrix[perms[i][0]].length; j++) {
                if(this.Matrix[perms[i][0]][j] === this.Matrix[perms[i][1]][j]) {
                    count++
                }
            }
            if(count === this.Matrix[perms[i][0]].length) {
                this.coloriage(0,perms[i], "blue", true, true);
                return Math.max(...perms[i]);
            }
        }
        return false;
    }


    
    getData() {
        const {table} = this;
        const Matrix = [];
        for(let i=0; i < table.rows.length; i++ ) {
            let row = [];
            let cells = table.rows[i].cells;
            for(let j = 0; j < cells.length; j++) {
                if(i !==0 && j!==0) {
                    row.push(cells[j].querySelector('input').value);
                }
                else if(i === 0 && j === 0) {
                    this.players = cells[j].querySelector('input').value.split('/');
                }
            }
            if(i!== 0 && row.length !== 0) {
                Matrix.push(row);
            }
        }
        return Matrix;
    }

    GetInputsTable() {
        let {table, NbStrsP1:nbP1, NbStrsP2:nbP2, btn} = this;
        let body = table.createTBody();
        for(let i = 0; i <= nbP1; i++) {
            let row = body.insertRow();
            for(let j = 0; j <= nbP2; j++) {
                row.insertCell().innerHTML = `<input type="text" />`;
            }
        }
        container.appendChild(table);
        btn.textContent = "Start";
        btn.onclick = () => {
            this.start();
        }
        container.appendChild(btn);
    }
}
