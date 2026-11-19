import React, { useState, useCallback, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Shuffle, Play } from 'lucide-react';
import './arcade.css';
import ArcadeCabinet from './components/ArcadeCabinet';

const ArcadeModal = React.lazy(() => import('./components/ArcadeModal'));

// Öne çıkan oyunlar (Portal kartında rozet olarak gösterilir)
const featuredHighlights = [
    { id: 'minecraft_classic', title: 'Minecraft Classic', color: '#55aa55' },
    { id: 'cs16', title: 'Kirka.io', color: '#ffd700' },
    { id: 'gtavicecity', title: 'GTA Vice City', color: '#ff66b2' },
    { id: 'quake3', title: 'Quake III', color: '#ffcc00' },

    { id: 'subway', title: 'Subway Surfers', color: '#00ffcc' },
    { id: 'doom', title: 'DOOM', color: '#ff0033' },
];

const GameLibrary = ({ isOpen, setIsOpen, activeGameId, setActiveGameId }) => {
    const { t } = useTranslation();
    const [gameReloadKey, setGameReloadKey] = useState(0);
    const [hasOpened, setHasOpened] = useState(false);

    const openModal = useCallback(() => {
        setHasOpened(true);
        setIsOpen(true);
    }, [setIsOpen]);

    const handleQuickShuffle = useCallback(() => {
        const randomPick = featuredHighlights[Math.floor(Math.random() * featuredHighlights.length)];
        setHasOpened(true);
        setIsOpen(true);
        setActiveGameId(randomPick.id);
        setGameReloadKey(prev => prev + 1);
    }, [setIsOpen, setActiveGameId]);

    const preloadModal = useCallback(() => {
        import('./components/ArcadeModal');
    }, []);

    return (
        <>
            <div
                onClick={openModal}
                onMouseEnter={preloadModal}
                className="arcade-portal-card"
            >
                <div className="arcade-portal-grid">
                    <div className="arcade-portal-content">
                        <span className="arcade-portal-kicker">
                            WASM &amp; WEBGL · {t('arcade_scoreboard')}
                        </span>

                        <h3 className="arcade-portal-title">
                            {t('arcade_title')}
                        </h3>

                        <p className="arcade-portal-subtitle">
                            {t('arcade_portal_desc')}
                        </p>

                        <div className="arcade-portal-chips">
                            {featuredHighlights.map((feat) => (
                                <button
                                    key={feat.id}
                                    type="button"
                                    className="arcade-portal-chip"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setHasOpened(true);
                                        setIsOpen(true);
                                        setActiveGameId(feat.id);
                                        setGameReloadKey((prev) => prev + 1);
                                    }}
                                    title={`${feat.title} - ${t('arcade_play')}`}
                                >
                                    <span>{feat.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="arcade-portal-actions">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={(e) => { e.stopPropagation(); openModal(); }}
                            >
                                <Play size={16} fill="currentColor" /> {t('arcade_portal_explore')}
                            </button>

                            <button
                                type="button"
                                className="btn-outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuickShuffle();
                                }}
                            >
                                <Shuffle size={15} /> {t('arcade_portal_shuffle')}
                            </button>
                        </div>
                    </div>

                    <div className="arcade-portal-visual">
                        <ArcadeCabinet />
                    </div>
                </div>
            </div>

            {(isOpen || hasOpened) && (
                <Suspense fallback={null}>
                    <ArcadeModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        activeGameId={activeGameId}
                        setActiveGameId={setActiveGameId}
                        gameReloadKey={gameReloadKey}
                        setGameReloadKey={setGameReloadKey}
                    />
                </Suspense>
            )}
        </>
    );
};

export default GameLibrary;
