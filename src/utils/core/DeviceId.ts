import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const GetDeviceId = async () => {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    let deviceId = localStorage.getItem('deviceId');

    if(!deviceId) {
        const result = await fp.get();
        deviceId = result.visitorId;
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}