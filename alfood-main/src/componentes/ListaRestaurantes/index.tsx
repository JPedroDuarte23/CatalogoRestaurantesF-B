import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { Box, Button, MenuItem, Select, TextField } from '@mui/material';

interface IParametrosBusca {
  ordering?: string,
  search?: string
}


const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('')

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const fetchRestaurantes = async (url: string, opcoes: AxiosRequestConfig = {}) => {
    try {
      const response = await axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      setRestaurantes(response.data.results)
      setProximaPagina(response.data.next)

    } catch (e) {
      console.error(e)
    }
  }

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca;
    }

    if(ordenacao) {
      opcoes.params.ordering = ordenacao;
    }

    fetchRestaurantes('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }



  useEffect(() => {
    fetchRestaurantes('http://localhost:8000/api/v1/restaurantes/')
  }, [])



  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(resposta => {
        setRestaurantes([...restaurantes, ...resposta.data.results])
        setProximaPagina(resposta.data.next)
        console.log(restaurantes)
      }).catch(e => {
        console.error(e)
      })

  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <Box component="form" onSubmit={buscar} sx={{ display: 'flex', gap: '12px ', alignItems: 'center'}}>
      <TextField type='text' value={busca} onChange={evento => setBusca(evento.target.value)} />
      <label htmlFor='select-ordenacao'>Ordenação</label>
      <Select
        id="select-ordenacao"
        name="select-ordenacao"
        value={ordenacao}
        onChange={evento => setOrdenacao(evento.target.value)}
      >
        <MenuItem value="">Padrão</MenuItem>
        <MenuItem value="id">Por ID</MenuItem>
        <MenuItem value="nome">Por Nome</MenuItem>
      </Select>
      <Button type='submit'>Buscar</Button>
    </Box>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {proximaPagina && <button onClick={verMais}>Ver mais</button>}
  </section>)
}

export default ListaRestaurantes