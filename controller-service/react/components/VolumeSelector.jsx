import React, { useEffect } from 'react';
import { Slider, Button } from 'antd';

let lastOnVolumeChange = new Date();

export default function VolumeSelector({
    volumeValue,
    isMuted,
    onVolumeChange,
    onMuteButtonClick,
}) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [volume, setVolume] = React.useState(volumeValue);
    useEffect(() => {
        if (isDragging) return;
        setVolume(volumeValue);
    }, [volumeValue, isMuted]);

    return (
        <div style={styles.container}>
            <Button
                type={!isMuted ? "primary" : "default"} onClick={onMuteButtonClick}
                danger={isMuted}
                style={{
                    // background: isMuted ? "#f2f2f2" : "#22A699",
                    fontSize: "20px",
                    height: "50px",
                }}
            >
                {isMuted ? "🔇" : "🔊"}
            </Button>
            <Slider
                trackStyle={{ backgroundColor: isMuted ? "#ccc" : "#1677ff" }}
                min={0} max={100}
                value={volume}
                onChange={(value) => {
                    setIsDragging(true);
                    if (new Date() - lastOnVolumeChange > 200) {
                        onVolumeChange(value);
                        lastOnVolumeChange = new Date();
                    }
                    setVolume(value)
                }}
                onAfterChange={async (value) => {
                    setVolume(value);
                    await onVolumeChange(value);
                    setIsDragging(false);
                }}
                style={{ flexGrow: 1, margin: "15px" }}
                tooltip={{
                    placement: "bottom",
                }}
            />
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
}