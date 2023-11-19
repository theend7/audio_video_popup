import { Component, ElementRef, ViewChild } from '@angular/core';

type PromiseResultAny = (result: any) => void;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

    @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef | undefined;

    constructor() {
        return;
    }

    private _closeStream(stream: any) {
        console.log(stream);
        if (!stream) return;
        const tracks: Array<MediaStreamTrack> = (stream.getTracks && stream.getTracks()) || [];
        console.log(tracks);
        tracks.forEach((track: MediaStreamTrack) => {
            if (!track) return;
            try { track.stop(); } catch (err) { return; }
        });
        if (stream.stop) stream.stop();
    }

    private _checkAudio(constraint: MediaStreamConstraints): Promise<any> {
        return new Promise<any>((resolve: PromiseResultAny, reject: PromiseResultAny) => {
            window.navigator.mediaDevices.getUserMedia(constraint).then((stream: MediaStream) => {
                this._closeStream(stream); // close stream
                this.ui.msg = 'Your microphone is enabled!';
                setTimeout(() => {
                    this.ui.msg = '';
                }, 3000);
                resolve({});
            }, (err) => {
                reject({ name: err.name });

                if (err.name == 'NotAllowedError') alert('Requested devices is not allowed, allow audio device(mic) so u can be able to use it.');
                if (err.name == 'NotFoundError') alert('Make sure you have an audio device on your computer.');
                if (err.name == 'NotReadableError') alert('Your audio device can not be used at this time, please try again later.');
                if (err.name == 'OverconstrainedError') alert('Your audio device can not be found.');

                //name: 'NotAllowedError' - Thrown if one or more of the requested source devices cannot be used at this time.
                //name: 'NotFoundError' - Thrown if no media tracks of the type specified were found that satisfy the given constraints.
                //name: 'NotReadableError' - Thrown if, although the user granted permission to use the matching devices, a hardware error occurred at the operating system, browser, or Web page level which prevented access to the device.
                //name: 'OverconstrainedError' - Thrown if the requested device (with exact option) is not found.
            });
        });
    }

    private _checkVideo(constraint: MediaStreamConstraints): Promise<any> {
        return new Promise<any>((resolve: PromiseResultAny, reject: PromiseResultAny) => {
            window.navigator.mediaDevices.getUserMedia(constraint).then((stream: MediaStream) => {
                if (!this.videoPlayer) return reject({});
                this.videoPlayer.nativeElement.srcObject = stream;
                this.ui.msg = 'Video will be active only 10 seconds';
                setTimeout(() => {
                    this._closeStream(stream); // close stream
                    if (!this.videoPlayer) return reject({});
                    this.videoPlayer.nativeElement.srcObject = null;
                    this.ui.msg = '';
                }, 10000);
                resolve({});
            }, (err) => {
                reject({ name: err.name });

                if (err.name == 'NotAllowedError') alert('Requested devices is not allowed, allow video device(cam) so u can be able to use it.');
                if (err.name == 'NotFoundError') alert('Make sure you have an video device on your computer.');
                if (err.name == 'NotReadableError') alert('Your video device can not be used at this time, please try again later.');
                if (err.name == 'OverconstrainedError') alert('Your video device can not be found.');
            });
        });
    }

    public ui = {
        msg: '',
        h: {
            audio: this._checkAudio.bind(this),
            video: this._checkVideo.bind(this)
        }
    }
}
