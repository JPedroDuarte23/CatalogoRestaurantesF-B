import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";

export default function FormularioRestaurante() {

    const parametros = useParams();
    const [nomeRestaurante, setNomeRestaurante] = useState("");

    useEffect(() => {
        if (parametros.id) {
            http.get<IRestaurante>(`restaurantes/${parametros.id}/`)
                .then(resposta => setNomeRestaurante(resposta.data.nome))
        }
    }, [parametros])


    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault()

        if (parametros.id) {
            http.put(`pratos/${parametros.id}/`,
                {
                    nome: nomeRestaurante
                }
            )
                .then(() => {
                    alert("Restaurante atualizado com sucesso")
                })

        } else {
            http.post('restaurantes/',
                {
                    nome: nomeRestaurante
                }
            )
                .then(() => {
                    alert("Restaurante cadastrado com sucesso")
                })

        }

    }

    return (

                    <Box sx={{ displa: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h6">Formulário de restaurantes</Typography>
                        <Box component="form" onSubmit={aoSubmeterForm}>
                            <TextField
                                value={nomeRestaurante}
                                onChange={evento => setNomeRestaurante(evento.target.value)}
                                label="Nome do restaurante"
                                variant="standard"
                                fullWidth
                                required
                            />
                            <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
                        </Box>
                    </Box>

    )
}