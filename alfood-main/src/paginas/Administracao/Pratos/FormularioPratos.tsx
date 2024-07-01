import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useParams } from "react-router-dom";
import IPrato from "../../../interfaces/IPrato";


export default function FormularioPratos() {
    const parametros = useParams();

    const [nomePrato, setNomePrato] = useState("");
    const [descricao, setDescricao] = useState("");

    const [tags, setTags] = useState<ITag[]>([]);
    const [tag, setTag] = useState("")

    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [restaurante, setRestaurante] = useState("")

    const [imagem, setImagem] = useState<File | null>(null);

    useEffect(() => {

        http.get<{ tags: ITag[] }>('tags/')
            .then(resposta => setTags(resposta.data.tags))

        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))

        if (parametros.id) {
            http.get<IPrato>(`pratos/${parametros.id}/`)
                .then(resposta => {
                    setNomePrato(resposta.data.nome);
                    setDescricao(resposta.data.descricao);
                    setTag(resposta.data.tag);
                    http.get<IRestaurante>(`restaurantes/${resposta.data.restaurante}/`)
                        .then(resposta => setRestaurante(resposta.data.nome))
                })
        }

    }, [parametros.id])

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0])
        } else {
            setImagem(null)
        }
    }

    const submeterFormulario = (evento: React.ChangeEvent<HTMLFormElement>) => {
        evento.preventDefault()

        const formData = new FormData();

        formData.append('nome', nomePrato)
        formData.append('descricao', descricao)
        formData.append('tag', tag)
        formData.append('restaurante', restaurante)

        if (imagem) {
            formData.append('imagem', imagem)
        }

        var metodo = parametros.id ? 'PUT' : 'POST';
        var url = parametros.id ? `pratos/${parametros.id}/` : 'pratos/'


        http.request({
            url: url,
            method: metodo,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                setNomePrato('')
                setDescricao('')
                setTag('')
                setRestaurante('')

                alert('Prato cadastrado com sucesso!')
            })
            .catch(erro => console.log(erro))
    }

    return (
        <Box sx={{ displa: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h6">Formulário de pratos</Typography>
            <Box component="form" onSubmit={submeterFormulario}>
                <TextField
                    value={nomePrato}
                    onChange={evento => setNomePrato(evento.target.value)}
                    label="Nome do Prato"
                    variant="standard"
                    fullWidth
                    required
                    margin="dense"
                />
                <TextField
                    value={descricao}
                    onChange={evento => setDescricao(evento.target.value)}
                    label="Descrição do prato"
                    variant="standard"
                    fullWidth
                    required
                />
                <FormControl margin="dense" fullWidth>
                    <Typography id="select-tag">Tag</Typography>
                    <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
                        {tags.map(tag =>
                            <MenuItem key={tag.id} value={tag.value}>
                                {tag.value}
                            </MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth>
                    <Typography id="select-tag">Restaurante</Typography>
                    <Select labelId="select-tag" value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
                        {restaurantes.map(restaurante =>
                            <MenuItem key={restaurante.id} value={restaurante.id}>
                                {restaurante.nome}
                            </MenuItem>)}
                    </Select>
                </FormControl>

                <input type="file" onChange={selecionarArquivo} />

                <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>

    )
}