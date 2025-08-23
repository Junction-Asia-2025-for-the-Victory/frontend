import videoHappinessUrl from "@/assets/animation/Happiness.webm";
import videoSadnessUrl from "@/assets/animation/Sadness.webm";
import videoAngerUrl from "@/assets/animation/Anger.webm";
import videoFeelAffectionUrl from "@/assets/animation/Feel_affection.webm";
import videoNeutralUrl from "@/assets/animation/Neutral.webm";
import videoWaitingUrl from "@/assets/animation/Waiting.webm";


interface ViedoPlayerProps {
    emotion: string;
}

function ViedoPlayer({ emotion }: ViedoPlayerProps) {
    let videoUrl = videoWaitingUrl;

    if (emotion === "happiness") {
        videoUrl = videoHappinessUrl;
    } else if (emotion === "sadness") {
        videoUrl = videoSadnessUrl;
    } else if (emotion === "anger") {
        videoUrl = videoAngerUrl;
    } else if (emotion === "feel_affection") {
        videoUrl = videoFeelAffectionUrl;
    } else if (emotion === "neutral") {
        videoUrl = videoNeutralUrl;
    } else if (emotion === "waiting") {
        videoUrl = videoWaitingUrl;
    }

    return (
        <div>
            <video src={videoUrl} autoPlay muted loop />
        </div>
    )
}

export default ViedoPlayer;