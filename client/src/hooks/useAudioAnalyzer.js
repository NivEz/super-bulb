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
                throttleEventHandler(Math.floor(average) || 1);
            }, 10)
        }

        var soundNotAllowed = function (error) {
            alert("Please allow microphone");
        }

        navigator.getUserMedia({audio: true}, soundAllowed, soundNotAllowed);

        return () => clearInterval(audioInterval);
    }, [isActive])
}
