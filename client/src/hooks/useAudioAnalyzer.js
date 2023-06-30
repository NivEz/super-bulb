import {useEffect} from "react";
import {useThrottle} from "./useThrottle.js";

export const useAudioAnalyzer = ({isActive, handleBrightness}) => {
    const throttleEventHandler = useThrottle({onChange: handleBrightness, delay: 100});

    useEffect(() => {
        if (!isActive) {
            return;
        }
        let audioInterval;
        var soundAllowed = function (stream) {
            window.persistAudioStream = stream;
            var audioContent = new AudioContext();
            var audioStream = audioContent.createMediaStreamSource(stream);
            var analyser = audioContent.createAnalyser();
            audioStream.connect(analyser);
            analyser.fftSize = 1024;

            var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

            audioInterval = setInterval(() => {
                analyser.getByteFrequencyData(frequencyArray);
                let valuesSum = 0;
                for (const value of frequencyArray)
                    valuesSum += value;
                const average = valuesSum / frequencyArray.length;
                console.log("-> average", Math.floor(average) || 1);
                throttleEventHandler(Math.floor(average) || 1);
            }, 25)

            var doDraw = function () {
                requestAnimationFrame(doDraw);
                analyser.getByteFrequencyData(frequencyArray);
                const arraySum = frequencyArray.reduce((a, value) => a + value, 0);
                const average = arraySum / frequencyArray.length;
                var adjustedLength;
                for (var i = 0; i < 255; i++) {
                    adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
                    // paths[i].setAttribute('d', 'M '+ (i) +',255 l 0,-' + adjustedLength);
                }

            }
            // doDraw();
        }

        var soundNotAllowed = function (error) {
            alert("Please allow microphone");
        }

        navigator.getUserMedia({audio: true}, soundAllowed, soundNotAllowed);

        return () => clearInterval(audioInterval);
    }, [isActive])
}
