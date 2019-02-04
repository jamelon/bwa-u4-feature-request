import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      success: false
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  componentWillMount() {
    Spotify.getAccessToken();
  }
  addTrack(track) {
    if(this.state.playlistTracks.find(currentTrack => currentTrack.id === track.id)) {
      return;
    } else {
      let newArray = this.state.playlistTracks;
      newArray.push(track);
      this.setState({playlistTracks: newArray});
    }
  }
  removeTrack(track) {
    const newArray = this.state.playlistTracks.filter(item => {
      return item.id !== track.id;
    })
    this.setState({playlistTracks: newArray});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist(){
    const trackURIs = [];
    this.state.playlistTracks.forEach(item => {
      const itemURI = item.uri;
      trackURIs.push(itemURI);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    document.getElementById("playlistName").value = 'New Playlist';
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
      success: true
    });
  }
  search(term){
    Spotify.search(term).then(track => {
      this.setState({searchResults: track})
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
