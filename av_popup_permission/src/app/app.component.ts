import { Component } from '@angular/core';

type PromiseResultAny = (result: any) => void;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent {

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
                this._closeStream(stream); // stream must be closed for security reasons
                this.ui.msg = 'Your microphone is enabled!';
                setTimeout(() => {
                    this.ui.msg = '';
                }, 4000);
                resolve({});
            }, (err) => {
                if (err.name == 'NotAllowedError') alert('Requested devices is not allowed, allow audio device(mic) so u can be able to use it.');
                if (err.name == 'NotFoundError') alert('Make sure you have an audio device on your computer.');
                if (err.name == 'NotReadableError') alert('Your device can not be used at this time, please try later.');
                if (err.name == 'OverconstrainedError') alert('Your device can not be found.');

                reject({ name: err.name });

                //name: 'NotAllowedError' - Thrown if one or more of the requested source devices cannot be used at this time.
                //name: 'NotFoundError' - Thrown if no media tracks of the type specified were found that satisfy the given constraints.
                //name: 'NotReadableError' - Thrown if, although the user granted permission to use the matching devices, a hardware error occurred at the operating system, browser, or Web page level which prevented access to the device.
                //name: 'OverconstrainedError' - Thrown if the requested device (with exact option) is not found.
            });
        });
    }

    private _checkVideo(): void {
        console.log('video!');
    }

    public ui = {
        msg: '',
        h: {
            audio: this._checkAudio.bind(this),
            video: this._checkVideo.bind(this)
        }
    }
}
