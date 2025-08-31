    let audio = document.getElementById('audioPlayer');
        let playPauseBtn = document.getElementById('playPauseBtn');
        let progress = document.getElementById('progress');
        let currentTimeSpan = document.getElementById('currentTime');
        let durationSpan = document.getElementById('duration');
        let songTitle = document.getElementById('songTitle');
        let volumeSlider = document.getElementById('volumeSlider');
        let volumePercent = document.getElementById('volumePercent');
        
        let isPlaying = false;
        let currentTrackIndex = 0;

        // Your playlist - replace with your actual audio files
        const playlist = [
            {
                title: "Track 1",
                artist: "Artist 1",
                src: "music/dungeon.mp3",
                duration: "3:45"
            },
            {
                title: "Track 2", 
                artist: "Artist 2",
                src: "music/godsown.mp3",
                duration: "4:12"
            }
        ];

        function initializePlaylist() {
            const playlistElement = document.getElementById('playlist');
            playlist.forEach((track, index) => {
                const trackElement = document.createElement('div');
                trackElement.className = 'track';
                trackElement.onclick = () => selectTrack(index);
                
                trackElement.innerHTML = `
                    <div class="track-number">${index + 1}</div>
                    <div class="track-info">
                        <div class="track-title">${track.title}</div>
                        <div class="track-artist">${track.artist}</div>
                    </div>
                    <div class="track-duration">${track.duration}</div>
                    <div class="now-playing-indicator" style="display: none;">♪</div>
                `;
                
                playlistElement.appendChild(trackElement);
            });
            
            // Load first track by default
            selectTrack(0);
        }

        function selectTrack(index) {
            currentTrackIndex = index;
            const track = playlist[index];
            
            // Update audio source
            audio.src = track.src;
            
            // Update song info
            songTitle.textContent = track.title;
            document.getElementById('songArtist').textContent = track.artist;
            
            // Update playlist visual state
            updatePlaylistDisplay();
            
            // Reset player state
            playPauseBtn.innerHTML = '▶️';
            isPlaying = false;
            progress.style.width = '0%';
            currentTimeSpan.textContent = '0:00';
        }

        function updatePlaylistDisplay() {
            const tracks = document.querySelectorAll('.track');
            tracks.forEach((track, index) => {
                const nowPlayingIndicator = track.querySelector('.now-playing-indicator');
                if (index === currentTrackIndex) {
                    track.classList.add('active');
                    if (isPlaying) {
                        nowPlayingIndicator.style.display = 'block';
                    } else {
                        nowPlayingIndicator.style.display = 'none';
                    }
                } else {
                    track.classList.remove('active');
                    nowPlayingIndicator.style.display = 'none';
                }
            });
        }

        function togglePlayPause() {
            if (isPlaying) {
                audio.pause();
                playPauseBtn.innerHTML = '▶️';
                isPlaying = false;
            } else {
                audio.play();
                playPauseBtn.innerHTML = '⏸️';
                isPlaying = true;
            }
            updatePlaylistDisplay();
        }

        function formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        }

        function updateProgress() {
            if (audio.duration) {
                let progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + '%';
                currentTimeSpan.textContent = formatTime(audio.currentTime);
            }
        }

        function seek(event) {
            if (audio.duration) {
                let progressBar = event.currentTarget;
                let clickX = event.offsetX;
                let width = progressBar.offsetWidth;
                let newTime = (clickX / width) * audio.duration;
                audio.currentTime = newTime;
            }
        }

        function changeVolume() {
            let volume = volumeSlider.value / 100;
            audio.volume = volume;
            volumePercent.textContent = volumeSlider.value + '%';
        }

        // Event listeners
        audio.addEventListener('loadedmetadata', function() {
            durationSpan.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', updateProgress);

        audio.addEventListener('ended', function() {
            playPauseBtn.innerHTML = '▶️';
            isPlaying = false;
            progress.style.width = '0%';
            audio.currentTime = 0;
            updatePlaylistDisplay();
            
            // Auto-play next track
            if (currentTrackIndex < playlist.length - 1) {
                selectTrack(currentTrackIndex + 1);
                setTimeout(() => {
                    togglePlayPause();
                }, 500);
            }
        });

        // Initialize volume and playlist
        changeVolume();
        initializePlaylist();