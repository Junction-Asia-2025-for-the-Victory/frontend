import videoHappinessUrl from "@/assets/animation/Happiness.webm";
import videoSadnessUrl from "@/assets/animation/Sadness.webm";
import videoAngerUrl from "@/assets/animation/Anger.webm";
import videoFeelAffectionUrl from "@/assets/animation/Feel_affection.webm";
import videoNeutralUrl from "@/assets/animation/Neutral.webm";
import videoWaitingUrl from "@/assets/animation/Waiting.webm";


interface ViedoPlayerProps {
    emotion: string;
    onVideoEnd?: () => void;
}

function ViedoPlayer({ emotion, onVideoEnd }: ViedoPlayerProps) {
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

    const handleVideoEnded = () => {
        // waiting이 아닌 감정 비디오가 끝났을 때만 콜백 호출
        if (emotion !== "waiting" && onVideoEnd) {
            onVideoEnd();
        }
    };

    return (
        <div>
            <video 
                src={videoUrl} 
                autoPlay 
                muted 
                loop={emotion === "waiting"} // waiting일 때만 loop
                onEnded={handleVideoEnded}
            />
        </div>
    )
}

export default ViedoPlayer;