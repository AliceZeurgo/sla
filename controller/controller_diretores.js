/**********************************************************************************************************************************************
* Objetivo: Arquivo responsável pela interação entre o APP e a model, que teremos todas as tratativas e regra de negocio para o CRUD de filmes*                                                 *                                                                     *
* Data: 30/01/24                                                                                                                              *
* Autor: Alice Zeurgo                                                                                                                        *
* Versão: 1.0                                                                                                                                 * 
***********************************************************************************************************************************************/
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import do arquivo de configurações do projeto
const message = require('../modulo/config.js')

// Import do arquivo DAO para manipular dados do BD
const diretoresDAO = require('../model/DAO/diretores.js')

// Função para inserir um novo Filme no Banco de dados
const setInserirNovoDiretor = async function (dadosFilme, contentType) {

    try {
        let statusValidated = false;
        let novoFilmeJson = {};
    
        if (String(contentType).toLowerCase() === 'application/json') {
            if (String(contentType).toLowerCase() === 'application/json') {
                if (!dadosFilme.nome || dadosFilme.nome.length > 500 ||
                    dadosFilme.id_classificacao === undefined || isNaN(dadosFilme.id_classificacao) ||
                    !dadosFilme.sinopse || dadosFilme.sinopse.length > 65000 ||
                    !dadosFilme.foto_capa || dadosFilme.foto_capa.length > 3000 ||
                    dadosFilme.valor === undefined || isNaN(dadosFilme.valor) ||
                    !dadosFilme.duracao || dadosFilme.duracao.length > 8 ||
                    !dadosFilme.data_lancamento || dadosFilme.data_lancamento.length !== 10 ||
                    dadosFilme.data_relancamento === undefined || dadosFilme.data_relancamento.length !== 10) {
                    return message.ERROR_REQUIRED_FIELDS;
                }
            }
                    
            } else {
                // Validação de um conteúdo válido
                if (dadosFilme.data_relancamento !== '' &&
                    dadosFilme.data_relancamento !== null &&
                    dadosFilme.data_relancamento !== undefined) {
                    // Verifica a quantidade de caracteres
                    if (dadosFilme.data_relancamento.length !== 10) {
                        return message.ERROR_REQUIRED_FIELDS;
                    } else {
                        statusValidated = true; // Validação para liberar a inserção dos dados do DAO
                    }
                } else {
                    statusValidated = true; // Validação para liberar a inserção dos dados do DAO
                }
    
                // Se a variável for verdadeira, podemos encaminhar os dados para o DAO
                if (statusValidated === true) {
                    // Encaminha os dados para o DAO
                    let novoFilme = await diretoresDAO.insertFilme(dadosFilme);
    
                    if (novoFilme) {
                        // Cria o JSON e retorna informações com a requisição e os dados novos
                        novoFilmeJson.status = message.SUCCESS_CREATED_ITEM.status;
                        novoFilmeJson.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                        novoFilmeJson.message = message.SUCCESS_CREATED_ITEM.message;
                        novoFilmeJson.filme = dadosFilme;
                        novoFilmeJson.id = dadosFilme.id;
    
                        return novoFilmeJson; // 201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB; // 500
                    }
                }
            }
       
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER;
    }
    
}

async function setAtualizarFilme(dadosFilme, contentType) {
    try {
        let statusValidated = false;
        let novoFilmeJson = {};

        if (String(contentType).toLowerCase() === 'application/json') {
            if (
                dadosFilme.nome === '' || dadosFilme.nome === undefined || dadosFilme.nome === null || dadosFilme.nome.length > 500 ||
                dadosFilme.id_classificacao === undefined || dadosFilme.id_classificacao === null || isNaN(dadosFilme.id_classificacao) ||
                dadosFilme.sinopse === '' || dadosFilme.sinopse === undefined || dadosFilme.sinopse === null || dadosFilme.sinopse.length > 65000 ||
                dadosFilme.foto_capa === '' || dadosFilme.foto_capa === undefined || dadosFilme.foto_capa === null || dadosFilme.foto_capa.length > 3000 ||
                dadosFilme.valor === undefined || dadosFilme.valor === null || isNaN(dadosFilme.valor) ||
                dadosFilme.duracao === '' || dadosFilme.duracao === undefined || dadosFilme.duracao === null || dadosFilme.duracao.length > 8 ||
                dadosFilme.data_lancamento === '' || dadosFilme.data_lancamento === undefined || dadosFilme.data_lancamento === null || dadosFilme.data_lancamento.length !== 10 ||
                dadosFilme.data_relancamento === undefined || dadosFilme.data_relancamento === null || dadosFilme.data_relancamento.length !== 10
            ) {
                return message.ERROR_REQUIRED_FIELDS;
            } else {
                if (
                    dadosFilme.data_relancamento !== '' &&
                    dadosFilme.data_relancamento !== null &&
                    dadosFilme.data_relancamento !== undefined
                ) {
                    if (dadosFilme.data_relancamento.length !== 10) {
                        return message.ERROR_REQUIRED_FIELDS;
                    } else {
                        statusValidated = true;
                    }
                } else {
                    statusValidated = true;
                }

                if (statusValidated) {
                    let novoFilme = await diretoresDAO.insertFilme(dadosFilme);

                    if (novoFilme) {
                        novoFilmeJson.status = message.SUCCESS_CREATED_ITEM.status;
                        novoFilmeJson.status_code = message.SUCCESS_CREATED_ITEM.status_code;
                        novoFilmeJson.message = message.SUCCESS_CREATED_ITEM.message;
                        novoFilmeJson.filme = dadosFilme;
                        novoFilmeJson.id = novoFilme.id;

                        return novoFilmeJson;
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB;
                    }
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.error("Erro durante a criação do filme:", error);
        return message.ERROR_INTERNAL_SERVER;
    }
}


    

// Função para excluir um filme existente
async function setExcluirFilme(id) {
    try {
        let idFilme = id

        //Validação para verificar se o ID é válido (vazio, indefinido ou não numérico)
        if (idFilme == '' || idFilme == undefined || isNaN(idFilme) || idFilme == null) {
            return message.ERROR_INVALID_ID //400
        } else {
            
            let filmeId = await diretoresDAO.selectByIdFilme(idFilme)

            if(filmeId.length > 0) {

                let filmeDeletado = await diretoresDAO.deleteFilme(idFilme)
                
                if(filmeDeletado){
                    return message.SUCESS_DELETE_ITEM //200
                }else{
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }else{
                return message.ERROR_NOT_FOUND //404
            }
        }
       } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500
       }
}

// Função para retornar todos os filmes do banco de dados
async function getListarDiretores() {
    // Cria uma variável do tipo JSON
    let filmesJSON = {};

    // Chama a função do DAO para buscar os dados no BD
    let dadosFilmes = await diretoresDAO.selectAllDiretores();

    // Verifica se existem dados retornados do DAO
    if (dadosFilmes) {
        // Montando o JSON para retornar para o APP
        filmesJSON.filmes = dadosFilmes;
        filmesJSON.quantidade = dadosFilmes.length;
        filmesJSON.status_code = 200;
        // Retorna o JSON montado
        return filmesJSON;
    } else {
        // Return false quando não houverem dados
        return false;
    }
}

// Função para buscar filme pelo ID
async function getBuscarFilme(id) {
    console.log("ID do filme recebido na função:", id);
    //recebe o id pelo app
    let idFilme = id
    idFilme = parseInt(idFilme)
    let filmeJson = {}

    //validaão para verificar o id do filme antes de encamnhar par o DAO
    if (idFilme == '' || idFilme == undefined || isNaN(idFilme)) {
        return message.ERROR_INVALID_ID;
    } else {
        //encminha o id do filme para o retorno do banco
        let dadosFilmes = await diretoresDAO.selectByIdFilme(idFilme);

        //Validação par\ verificar se o DAO retorou dados
        if (dadosFilmes) {

            if (dadosFilmes && dadosFilmes.length > 0) {
                filmeJson.filme = dadosFilmes;
                filmeJson.status_code = 200;

                return filmeJson;

            } else {
                return message.ERROR_NOT_FOUND;
            }
            //monsta o json com o retorno dos dados
        } else {
            return message.ERROR_INTERNAL_SERVER;
        }
    }
}

module.exports = {
    setInserirNovoDiretor,
    getListarDiretores
 };
