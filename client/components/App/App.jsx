import React from 'react';
import styles from "./App.css";

export default class App extends React.Component {

	constructor() {
		super();
		this.getTopArtists = this.getTopArtists.bind(this);
		this.getTopSongs = this.getTopSongs.bind(this);
		this.fetchTrackLyrics = this.fetchTrackLyrics.bind(this);
		this.fetchTrackId = this.fetchTrackId.bind(this);
		this.getTrackDetails = this.getTrackDetails.bind(this);

	}
	// get username method


	getTopArtists(resolve, reject){
		let username = "rj";
		let topFiveArtists = [];
		const apiKey = "bda062e0447e46d6e98a08f5fc675af7";
		const url = "http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user="+username+"&api_key="+apiKey+"&format=json";
		console.log("fetchin top artists");
		fetch(url)
		.then((resp)=>resp.json())
		.then(function(data){
			const topArtists = data.topartists.artist;
			//console.log(topArtists);
			for(let artist of topArtists){
				topFiveArtists.push(artist.name);
			}
			const finalFiveArtists = topFiveArtists.slice(0,5);
			//console.log(finalFive);
			resolve(finalFiveArtists);
		})
		.catch(function(error) {
	    	reject(error);
	  	});
	}

	// get top songs method
	getTopSongs(topFive, resolve, reject){
		console.log(topFive);
		let topFiveTracks = [];
		const apiKey = "bda062e0447e46d6e98a08f5fc675af7";
		const url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist="+topFive[0]+"&api_key="+apiKey+"&format=json";
		console.log("fetching top tracks for the artists");
		fetch(url)
		.then((resp)=>resp.json())
		.then(function(data){
			const topTracks = data.toptracks.track;
			for(let track of topTracks){
				topFiveTracks.push(track.name);
			}
			const finalFiveTracks = topFiveTracks.slice(0,5);
			console.log(finalFiveTracks);
		//	resolve(finalFiveTracks);
		})
		.catch(function(error) {
	    	reject(error);
	  	});
	}

	fetchTrackId(resolve, reject){
		
			const apiKey = "8e56e3fe5dc95068f3d351f91b2b1d56";
			let artistName = "Rihanna";
			let trackName = "Umbrella";

			const url = "http://api.musixmatch.com/ws/1.1/track.search?q_artist="+artistName+"&q_track="+trackName+"&apikey="+apiKey;
			console.log("Fetching track ID");

			fetch(url)
			.then((resp)=>resp.json())
			.then(function(data){
				// retrieve response obj
				const trackList = data.message.body.track_list;
				console.log(trackList);
				const filtered = trackList.filter(removeRemixes);
				console.log(filtered);
				if(filtered.length > 0) resolve(filtered[0].track.track_id); 
				else reject("No non-remixes found"); 
			}) 
			.catch(function(error) {
	    		reject(error);
	  		});
		
			function removeRemixes(title){
				let {track_name } = title.track;
				if(track_name.toLowerCase().indexOf("remix") > -1) return false;
				if(track_name.toLowerCase().indexOf("rmx") > -1) return false;
				if(track_name.toLowerCase().indexOf("mix") > -1) return false;
				return true;
			}
	}

	fetchTrackLyrics(id) {
		
		const apiKey = "8e56e3fe5dc95068f3d351f91b2b1d56";

		console.log("Fetching Lyrics");
		const url = "http://api.musixmatch.com/ws/1.1/track.snippet.get?track_id="+id+"&apikey="+apiKey;

		fetch(url)
		.then((resp)=>resp.json())
		.then(function(data){
			console.log(data.message.body.snippet.snippet_body);
			console.log("id: "+id);
		}) 
		.catch(function(error) {
    		console.log(error);
  		});   
	}

	linkSongsAndLyrics(){
		new Promise(this.getTopSongs)
		.then(this.fetchTrackId)
		.catch((error)=>{
			console.log(error);
		})
	}
	
	getTrackDetails(){
		
		new Promise(this.fetchTrackId)
		.then(this.fetchTrackLyrics)
		.catch((error)=>{
			console.log(error);
		});

	}

	getArtistDetails(){
		new Promise(this.getTopArtists)
		.then(this.getTopSongs)
		.catch((error)=>{
			console.log(error);
		})
	}

	componentDidMount(){
		//this.getTrackDetails();
		this.getArtistDetails();
	}

	render() {
		//this.getTopSongs();
		return (
        	<h1 className={styles.test}>
        		
        	</h1>
		);
	}
}
