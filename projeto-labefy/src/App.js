import React from 'react'
import axios from 'axios'
// import styled from 'styled-components'
import './App.css'

// Imagens importadas
import logo from './imagens/logo-principal.png'
import apagar from './imagens/apagar.png'
import criar from './imagens/criar.png'
import tocar from './imagens/tocar.png'

class App extends React.Component {
  // Estados criados.
  state = {
    playlist: [],
    inputPlaylist: '',
    musicas: [],
    inputMusicas: '',
    inputArtistas: '',
    inputUrl: '',
    idPlaylist: '',
    tocar: false,
    playNaMusica: {}
  }

  // Atualizando o ciclo de vida do componente para ele renderizar no site automático, sem precisar clicar em atualizar.
  componentDidMount() {
    this.renderizarPlaylist()
  }

  // Esta requisição serve para ver o id e o name de todas as suas playlists. (getAllPlaylists)
  renderizarPlaylist = () => {
    axios
      .get(
        'https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists',
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(response => {
        this.setState({ playlist: response.data.result.list })
      })
      .catch(err => {
        alert(err.response.data)
      })
  }

  // Essa requisição cria uma nova playlist. (createPlaylist)
  criarPlaylist = () => {
    const body = {
      name: this.state.inputPlaylist
    }

    axios
      .post(
        'https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists',
        body,
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(() => {
        this.setState({ inputPlaylist: '' })
        this.renderizarPlaylist()
      })
      .catch(err => {
        console.log(err.response.data)
      })
  }

  // Essa função foi criada para dar o onChange no input para criar as Playlists.
  onChangePlaylist = event => {
    this.setState({ inputPlaylist: event.target.value })
  }

  // Essa função cria a ID da Playlist.
  criaIdPlaylist = id => {
    this.setState({
      criarMusicas: !this.state.criarMusicas,
      idPlaylist: id
    })
  }

  // Essa requisição adiciona uma música a uma playlist existente (addTrackToPlaylist).
  criarMusicas = () => {
    const body = {
      name: this.state.inputMusicas,
      artist: this.state.inputArtistas,
      url: this.state.inputUrl
    }

    axios
      .post(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${this.state.idPlaylist}/tracks`,
        body,
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(() => {
        this.setState({ inputMusicas: '', inputArtistas: '', inputUrl: '' })
        alert('Música adicionada com sucesso!')
        this.selecionaPlaylist(this.state.idPlaylist)
      })
      .catch(err => {
        console.log(err.response.data)
        alert('Ops, Erro ao adicionar a Música!')
      })
  }

  // Esta requisição permite verificar quais músicas estão em uma determinada playlist (getPlaylistTracks).
  selecionaPlaylist = id => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(response => {
        this.setState({ musicas: response.data.result.tracks, idPlaylist: id })
      })
      .catch(err => {
        alert(err.response.data)
      })
  }

  // Essa função foi criada para dar o onChange no input para criar as músicas.
  onChangeMusicas = event => {
    this.setState({ inputMusicas: event.target.value })
  }

  // Essa função foi criada para dar o onChange no input para criar os artistas.
  onChangeArtistas = event => {
    this.setState({ inputArtistas: event.target.value })
  }

  // Essa função foi criada para dar o onChange no input para criar as URL das músicas.
  onChangeUrl = event => {
    this.setState({ inputUrl: event.target.value })
  }

  // Esta requisição serve para deletar alguma playlist (deletePlaylist).
  deletaPlaylist = id => {
    axios
      .delete(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}`,
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(response => {
        alert('Playlist excluída com sucesso!')
        this.renderizarPlaylist()
      })
      .catch(error => {
        console.log(error)
        alert('Ops, aconteceu um erro ao excluir a Playlist!')
      })
  }

  // Função para tocar música
  tocarMusicas = musica => {
    this.setState({
      playNaMusica: musica,
      tocar: !this.state.tocar
    })
  }

  // Esta requisição serve para deletar alguma música de alguma playlist (removeTrackFromPlaylist).
  deletaMusicas = id => {
    axios
      .delete(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${this.state.idPlaylist}/tracks/${id}`,
        {
          headers: {
            Authorization: 'mariana-goncalves-hopper'
          }
        }
      )
      .then(() => {
        this.selecionaPlaylist(this.state.idPlaylist)
        alert('Música excluída com sucesso!')
      })
      .catch(error => {
        alert('Ops, aconteceu um erro ao excluir Música!')
      })
  }

  render() {
    return (
      <body>
        <header className="header">
          <div className="logo">
            <img className="logo-img" src={logo} alt="Logotipo do Labefy" />
            <h3 className="h3-gradiente">Labefy</h3>
          </div>
          <div className="texto-header">
            <p className="p-gradiente">Uma experiência incrível</p>
          </div>
        </header>
        <main className="main">
          <div>
            <div className="criar-playlist">
              <p className="p-gradiente">Crie sua Playlist</p>
              <div>
                <input
                  className="inputPlaylist"
                  placeholder="Insira o nome da playlist"
                  value={this.state.inputPlaylist}
                  onChange={this.onChangePlaylist}
                  type="text"
                />
                <button className="buttonPlaylist" onClick={this.criarPlaylist}>
                  Criar Playlist
                </button>
              </div>
            </div>
            {/* {this.state.criarMusicas && ( */}
            <div className="criar-musicas">
              <p className="p-gradiente">Adicione suas músicas</p>
              <div>
                <input
                  className="inputsMusicas"
                  placeholder="Insira o nome da Música"
                  value={this.state.inputMusicas}
                  onChange={this.onChangeMusicas}
                  type="text"
                />
                <input
                  className="inputsMusicas"
                  placeholder="Insira o nome do Artista"
                  value={this.state.inputArtistas}
                  onChange={this.onChangeArtistas}
                  type="text"
                />
                <input
                  className="inputsMusicas"
                  placeholder="Insira a url da Música"
                  value={this.state.inputUrl}
                  onChange={this.onChangeUrl}
                  type="url"
                />
              </div>
              <button
                className="buttonAdicionarMusicas"
                onClick={this.criarMusicas}
              >
                Adicionar Músicas
              </button>
            </div>
            {/* )} */}
            {this.state.tocar && (
              <div className="tocar-musica">
                <div>
                  <p className="p-gradiente">Tocando Música</p>
                  <div className="tocando">
                    <h4>{this.state.playNaMusica.name}</h4>
                    <h4>{this.state.playNaMusica.artist}</h4>
                  </div>
                </div>
                <div>
                  <audio controls autoPlay>
                    <source src={this.state.playNaMusica.url}></source>
                  </audio>
                </div>
              </div>
            )}
          </div>
          <div className="playlists-criadas">
            <p className="p-gradiente">Suas Playlists</p>
            <div>
              {this.state.playlist.map(play => {
                return (
                  <div className="playlist-nomes" key={play.id}>
                    <h3 onClick={() => this.selecionaPlaylist(play.id)}>
                      {play.name}
                    </h3>
                    <div>
                      <img
                        src={criar}
                        width="25vh"
                        onClick={() => this.criaIdPlaylist(play.id)}
                      />
                      <img
                        src={apagar}
                        width="25vh"
                        onClick={() => this.deletaPlaylist(play.id)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="musicas-criadas">
            <p className="p-gradiente">Suas Músicas</p>
            <div>
              {this.state.musicas.map(musica => {
                return (
                  <div className="playlist-musicas" key={musica.id}>
                    <div>
                      <h4>
                        {musica.name} - {musica.artist}
                      </h4>
                    </div>
                    <div>
                      <img
                        src={tocar}
                        width="25vh"
                        onClick={() => this.tocarMusicas(musica)}
                      />
                      <img
                        src={apagar}
                        width="25vh"
                        onClick={() => this.deletaMusicas(musica.id)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
        <footer className="footer">
          <p className="p-gradiente">
            © 2022 Labefy | by Mariana Abdias Gonçalves
          </p>
        </footer>
      </body>
    )
  }
}

export default App
