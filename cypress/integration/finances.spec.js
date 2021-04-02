/// <reference types= "cypress" />>

    import { format, prepareLocalStorage } from '../support/utils'

    //entender o fluxo manualmente 
    //mapear os elementos que vamos interagir 
    //descrever as interaçoes com o cypress
    //adicionar as assercoes que a gente precisa 


context('Dev Finances Agilizei', () => {

    //hooks
    //trechos que executam antes e depois do teste 
    //before -> antes de todos os testes 
    //beforeEach -> antes de cada teste 
    //after -> depois de todos os testes
    //afterEach -> depois de cada teste 

    beforeEach(() =>{
        //acessa site 
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
        //cy.get('#data-table tbody tr').should('have.length', 2) //tabela
    });

    //cadastrar entradas
    it('Cadastrar entradas', () => {
       
        cy.get('#transaction .button').click() //botão nova transação
        cy.get('#description').type('Salario') //'descrição'
        cy.get('[name=amount]').type(1200) //valor
        cy.get('[type=date]').type('2021-03-29') //data
        cy.get('button').contains('Salvar').click() //botão salvar 

        cy.get('#data-table tbody tr').should('have.length', 3) //tabela
    });

    //Cadastrar saidas
    it('Cadastrar saidas', () => {
       
        cy.get('#transaction .button').click() //botão nova transação
        cy.get('#description').type('Salario') //descrição
        cy.get('[name=amount]').type(-200) //valor 
        cy.get('[type=date]').type('2021-03-29') //datas
        cy.get('button').contains('Salvar').click() //botão salvar

        cy.get('#data-table tbody tr').should('have.length', 3) //tabelas
    })

    //Remover entradas e saidas
    it('Remover entradas e saidas', () => {
        //const entrada = 'Salario'
        //const saida = 'Alimento'

        //cy.get('#transaction .button').click() //id+classe
        //cy.get('#description').type(entrada) //id
        //cy.get('[name=amount]').type(1000) //atributos 
        //cy.get('[type=date]').type('2021-03-29') //atributos 
        //cy.get('button').contains('Salvar').click() //tipo e valor

        //cy.get('#transaction .button').click() //id+classe
        //cy.get('#description').type(saida) //id
        //cy.get('[name=amount]').type(-500) //atributos 
        //cy.get('[type=date]').type('2021-03-29') //atributos 
        //cy.get('button').contains('Salvar').click() //tipo e valor

        //estrategia 1: voltar para o elemento pai, e avancar para um td img e atributo

        cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]') //erro aqui faltou a estrelinha
        .click()

        //estrategia 2: bucar odos os irmaos, e buscar o que tem img e atributo

        cy.get('td.description')
        .contains('Suco Kapo')
        .siblings()
        .children('img[onclick*=remove]') //erro aqui faltou a estrelinha
        .click()
        
        cy.get('#data-table tbody tr').should('have.length', 0)

    })


    it('Validar saldo com diversas transações', () =>{
        
        //cy.get('#transaction .button').click() //botão nova transação
        //cy.get('#description').type('Salario') //descrição
        //cy.get('[name=amount]').type(100) //valor 
        //cy.get('[type=date]').type('2021-03-29') //datas
        //cy.get('button').contains('Salvar').click() //botão salvar

        //cy.get('#transaction .button').click() //botão nova transação
        //cy.get('#description').type('Salario') //descrição
        //cy.get('[name=amount]').type(-135) //valor 
        //cy.get('[type=date]').type('2021-03-29') //datas
        //cy.get('button').contains('Salvar').click() //botão salvar

        //capturar as linhas com as transações 
        //capturar o texto dessas colas
        //formatar esses valores das linhas 

        //comparar o somatorio de entradas e despesas com o total

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            //cy.log(index)
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                //cy.log(text)
                //cy.log(format(text))

                //somar os valores de entrada e saida
                if(text.includes('-')){
                    expenses = expenses + format(text)
                }else{
                    incomes = incomes + format(text)
                }
            
                cy.log('entradas', incomes)
                cy.log('saidas', expenses)
            })
        })
            //capturar o texto do total
            cy.get('#totalDisplay').invoke('text').then(text => {

                //cy.log('valor total', format(text))
                let formattedTotalDisplay = format(text)
                let expectedTotal = incomes + expenses

                expect(formattedTotalDisplay).to.eq(expectedTotal)
            })
    })

});

    //cy.viewport  
    //arquivos de config
    //configs por linha de comando

