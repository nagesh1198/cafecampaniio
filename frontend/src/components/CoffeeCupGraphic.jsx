'use client';

import React, { useMemo } from 'react';
import { baristaAudio } from './AudioBarista';
import { Flame, Snowflake, Sparkles } from 'lucide-react';

export default function CoffeeCupGraphic({ config, onCupClick }) {
  const {
    temperature = 'hot',
    size = '16oz',
    shots = 2,
    base = 'Espresso',
    milk = 'oat',
    syrup = 'vanilla',
    syrupPumps = 2,
    sweetness = 50,
    ice = 50,
    topping = 'microfoam',
    latteArt = 'heart'
  } = config;

  // Color mapping based on selections
  const colors = useMemo(() => {
    // Espresso base color
    let espressoColor = '#241209';
    if (base === 'Blonde Espresso') espressoColor = '#3f2113';
    if (base === 'Decaf') espressoColor = '#2b170e';
    if (base === 'Cold Brew') espressoColor = '#180903';

    // Milk blend tint
    let milkColor = 'transparent';
    let hasMilk = milk !== 'none';
    if (milk === 'whole') milkColor = '#fcf8ee';
    else if (milk === 'oat') milkColor = '#f7eedb';
    else if (milk === 'almond') milkColor = '#f3e8d2';
    else if (milk === 'coconut') milkColor = '#faf5ed';
    else if (milk === 'sweet-cream') milkColor = '#fff6de';
    else if (milk === 'breve') milkColor = '#faeecd';

    // Syrup color
    let syrupColor = 'transparent';
    let hasSyrup = syrup !== 'none' && syrupPumps > 0;
    if (syrup === 'vanilla') syrupColor = '#f4c56e';
    else if (syrup === 'caramel') syrupColor = '#c9782c';
    else if (syrup === 'hazelnut') syrupColor = '#a85b24';
    else if (syrup === 'brown-sugar') syrupColor = '#6b3719';
    else if (syrup === 'mocha') syrupColor = '#37180d';
    else if (syrup === 'lavender') syrupColor = '#b597c9';

    // Blended main liquid color when milk is mixed with coffee
    let mixedColor = espressoColor;
    if (hasMilk) {
      if (milk === 'oat' || milk === 'almond') mixedColor = '#7a4f32';
      else if (milk === 'sweet-cream') mixedColor = '#5e341f';
      else mixedColor = '#8a5c3d';
    }

    return { espressoColor, milkColor, syrupColor, mixedColor, hasMilk, hasSyrup };
  }, [base, milk, syrup, syrupPumps]);

  // Size geometry calculation
  const sizeDims = useMemo(() => {
    switch (size) {
      case '8oz':
        return { cupHeight: 190, cupWidthTop: 160, cupWidthBottom: 110, saucerWidth: 200, scale: 0.88 };
      case '12oz':
        return { cupHeight: 220, cupWidthTop: 170, cupWidthBottom: 120, saucerWidth: 220, scale: 0.94 };
      case '20oz':
        return { cupHeight: 270, cupWidthTop: 185, cupWidthBottom: 130, saucerWidth: 240, scale: 1.05 };
      case '16oz':
      default:
        return { cupHeight: 245, cupWidthTop: 180, cupWidthBottom: 125, saucerWidth: 230, scale: 1.0 };
    }
  }, [size]);

  // Handle cup click interaction
  const handleInteraction = () => {
    if (temperature === 'hot') {
      baristaAudio.playSteam();
    } else {
      baristaAudio.playIceClink();
    }
    if (onCupClick) onCupClick();
  };

  const isIced = temperature === 'iced';

  return (
    <div
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      title="Click the cup to interact with barista sound!"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'pointer',
        padding: '30px 10px',
        userSelect: 'none'
      }}
    >
      {/* Temperature & steam badges */}
      <div style={{ position: 'absolute', top: 0, left: 16, display: 'flex', gap: 8, zIndex: 10 }}>
        {isIced ? (
          <span className="badge-tag" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <Snowflake size={13} /> Iced & Chilled ({ice}% Ice)
          </span>
        ) : (
          <span className="badge-tag" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <Flame size={13} /> Steaming Hot (65°C)
          </span>
        )}
        <span className="badge-tag badge-gold">
          <Sparkles size={13} /> {shots} {shots === 1 ? 'Shot' : 'Shots'} Espresso
        </span>
      </div>

      {/* Dynamic Cup Container */}
      <div
        style={{
          position: 'relative',
          width: sizeDims.cupWidthTop + 60,
          height: sizeDims.cupHeight + 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${sizeDims.scale})`,
          transition: 'all 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)'
        }}
      >
        {/* Steam particles for Hot coffee */}
        {!isIced && (
          <div
            style={{
              position: 'absolute',
              top: 5,
              width: 120,
              height: 70,
              pointerEvents: 'none',
              zIndex: 8,
              display: 'flex',
              justifyContent: 'space-around'
            }}
          >
            <div
              className="steam-particle-1"
              style={{
                width: 14,
                height: 38,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(255, 240, 220, 0.6) 0%, transparent 70%)',
                filter: 'blur(4px)'
              }}
            />
            <div
              className="steam-particle-2"
              style={{
                width: 18,
                height: 48,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(255, 240, 220, 0.7) 0%, transparent 70%)',
                filter: 'blur(5px)'
              }}
            />
            <div
              className="steam-particle-3"
              style={{
                width: 12,
                height: 34,
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(255, 240, 220, 0.5) 0%, transparent 70%)',
                filter: 'blur(4px)'
              }}
            />
          </div>
        )}

        {/* Straw for Iced Drinks */}
        {isIced && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: sizeDims.cupWidthTop * 0.35,
              width: 14,
              height: sizeDims.cupHeight + 20,
              background: 'linear-gradient(90deg, #d2a679 0%, #e8c49e 50%, #b08253 100%)',
              borderRadius: '7px',
              transform: 'rotate(14deg)',
              zIndex: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', top: 32, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.4)' }} />
          </div>
        )}

        {/* Cup Graphic SVG & Layers */}
        <svg
          width={sizeDims.cupWidthTop + 60}
          height={sizeDims.cupHeight + 40}
          viewBox={`0 0 ${sizeDims.cupWidthTop + 60} ${sizeDims.cupHeight + 40}`}
          style={{ overflow: 'visible', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Cup Body Clipping Path for liquid containment */}
            <clipPath id="cupInnerClip">
              <path
                d={`
                  M ${30 + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 15}
                  L ${30 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 15}
                  Q ${30 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2 + 2} ${sizeDims.cupHeight + 20} ${30 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2 - 5} ${sizeDims.cupHeight + 22}
                  L ${35 + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 22}
                  Z
                  M 30 50
                  L ${30 + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 18}
                  L ${30 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 18}
                  L ${30 + sizeDims.cupWidthTop} 50
                  Z
                `}
              />
            </clipPath>

            {/* Gradients */}
            <linearGradient id="ceramicSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="80%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="15%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="coffeeEspressoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.mixedColor} />
              <stop offset="40%" stopColor={colors.espressoColor} />
              <stop offset="100%" stopColor="#1a0a04" />
            </linearGradient>

            <linearGradient id="syrupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.syrupColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={colors.syrupColor} stopOpacity="1" />
            </linearGradient>

            <linearGradient id="cremaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e4be88" />
              <stop offset="50%" stopColor="#c59050" />
              <stop offset="100%" stopColor="#925b29" />
            </linearGradient>

            <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffbf3" />
              <stop offset="80%" stopColor="#f3e7d5" />
              <stop offset="100%" stopColor="#e2caa9" />
            </linearGradient>
          </defs>

          {/* Ceramic Cup Handle (Hot mode only) */}
          {!isIced && (
            <path
              d={`
                M ${30 + sizeDims.cupWidthTop - 8} 80
                C ${30 + sizeDims.cupWidthTop + 45} 80,
                  ${30 + sizeDims.cupWidthTop + 45} ${sizeDims.cupHeight - 30},
                  ${30 + sizeDims.cupWidthTop - 18} ${sizeDims.cupHeight - 40}
              `}
              fill="none"
              stroke="#2c1a11"
              strokeWidth="18"
              strokeLinecap="round"
            />
          )}
          {!isIced && (
            <path
              d={`
                M ${30 + sizeDims.cupWidthTop - 8} 80
                C ${30 + sizeDims.cupWidthTop + 45} 80,
                  ${30 + sizeDims.cupWidthTop + 45} ${sizeDims.cupHeight - 30},
                  ${30 + sizeDims.cupWidthTop - 18} ${sizeDims.cupHeight - 40}
              `}
              fill="none"
              stroke="#e79948"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
          )}

          {/* Saucer / Coaster Under Cup */}
          <ellipse
            cx={30 + sizeDims.cupWidthTop / 2}
            cy={sizeDims.cupHeight + 25}
            rx={sizeDims.saucerWidth / 2}
            ry={15}
            fill="#180e09"
            stroke="rgba(212, 163, 115, 0.25)"
            strokeWidth="1.5"
          />
          <ellipse
            cx={30 + sizeDims.cupWidthTop / 2}
            cy={sizeDims.cupHeight + 25}
            rx={sizeDims.saucerWidth / 2 - 14}
            ry={9}
            fill="#22140d"
            stroke="rgba(212, 163, 115, 0.15)"
            strokeWidth="1"
          />

          {/* Outer Cup Body Shape */}
          <path
            d={`
              M 30 50
              L ${30 + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 18}
              Q ${30 + sizeDims.cupWidthTop / 2} ${sizeDims.cupHeight + 28} ${30 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 18}
              L ${30 + sizeDims.cupWidthTop} 50
              Z
            `}
            fill={isIced ? 'rgba(255, 255, 255, 0.04)' : '#26160e'}
            stroke={isIced ? 'rgba(255, 255, 255, 0.35)' : 'rgba(235, 175, 115, 0.3)'}
            strokeWidth={isIced ? '2' : '3'}
          />

          {/* LIQUID LAYERS (Clipped to inside cup) */}
          <g clipPath="url(#cupInnerClip)">
            {/* 1. Base Espresso / Coffee Liquid */}
            <rect
              x="20"
              y="55"
              width={sizeDims.cupWidthTop + 20}
              height={sizeDims.cupHeight}
              fill="url(#coffeeEspressoGrad)"
              className="liquid-layer"
            />

            {/* 2. Milk Blend Gradient Layer */}
            {colors.hasMilk && (
              <rect
                x="20"
                y="55"
                width={sizeDims.cupWidthTop + 20}
                height={sizeDims.cupHeight * 0.72}
                fill={colors.milkColor}
                opacity="0.65"
                className="liquid-layer"
                style={{ mixBlendMode: 'soft-light' }}
              />
            )}

            {/* 3. Bottom Syrup Layer (Caramel, Vanilla, Mocha) */}
            {colors.hasSyrup && (
              <g>
                <rect
                  x="20"
                  y={sizeDims.cupHeight - Math.min(45, syrupPumps * 12)}
                  width={sizeDims.cupWidthTop + 20}
                  height={Math.min(50, syrupPumps * 14) + 15}
                  fill="url(#syrupGrad)"
                  className="liquid-layer"
                />
                {/* Syrup swirl curve */}
                <path
                  d={`
                    M 35 ${sizeDims.cupHeight - Math.min(45, syrupPumps * 12)}
                    Q ${30 + sizeDims.cupWidthTop * 0.4} ${sizeDims.cupHeight - Math.min(45, syrupPumps * 12) - 8},
                      ${30 + sizeDims.cupWidthTop * 0.8} ${sizeDims.cupHeight - Math.min(45, syrupPumps * 12) + 2}
                  `}
                  fill="none"
                  stroke={colors.syrupColor}
                  strokeWidth="3"
                  opacity="0.8"
                />
              </g>
            )}

            {/* 4. Floating Ice Cubes (for Iced) */}
            {isIced && (
              <g>
                {/* Ice Cube 1 */}
                <g className="ice-cube-anim-1" transform="translate(60, 100)">
                  <rect
                    width="42"
                    height="38"
                    rx="8"
                    fill="rgba(255, 255, 255, 0.4)"
                    stroke="rgba(255, 255, 255, 0.7)"
                    strokeWidth="1.5"
                  />
                  <line x1="8" y1="8" x2="34" y2="8" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="8" y1="8" x2="8" y2="30" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Ice Cube 2 */}
                <g className="ice-cube-anim-2" transform="translate(125, 120) rotate(12)">
                  <rect
                    width="46"
                    height="40"
                    rx="8"
                    fill="rgba(255, 255, 255, 0.38)"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="1.5"
                  />
                  <line x1="10" y1="10" x2="36" y2="10" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.5" />
                </g>

                {/* Ice Cube 3 */}
                <g className="ice-cube-anim-3" transform="translate(85, 160) rotate(-8)">
                  <rect
                    width="40"
                    height="36"
                    rx="8"
                    fill="rgba(255, 255, 255, 0.32)"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Condensation drips on glass */}
                <circle cx="55" cy="140" r="2.5" fill="rgba(255,255,255,0.6)" className="condensation-drip" />
                <circle cx="150" cy="165" r="2" fill="rgba(255,255,255,0.6)" className="condensation-drip" />
                <circle cx="80" cy="190" r="3" fill="rgba(255,255,255,0.6)" />
              </g>
            )}

            {/* 5. Foam or Whipped Cream Crown */}
            {topping === 'whipped-cream' ? (
              <g transform="translate(0, -5)">
                {/* Fluffy whipped cream peaks */}
                <path
                  d={`
                    M 35 62
                    C 45 40, 65 35, 75 48
                    C 85 28, 115 25, 125 45
                    C 135 30, 160 32, 175 48
                    C 185 38, 200 45, 205 62
                    Z
                  `}
                  fill="#fffdf8"
                  stroke="#eddcc5"
                  strokeWidth="1.5"
                />
                <path
                  d="M 95 32 Q 115 15 125 28 Q 120 40 100 38 Z"
                  fill="#ffffff"
                  stroke="#ecd8be"
                  strokeWidth="1.5"
                />
              </g>
            ) : (
              /* Silky Microfoam / Crema Surface Layer */
              <rect
                x="25"
                y="52"
                width={sizeDims.cupWidthTop + 10}
                height="18"
                fill={colors.hasMilk ? 'url(#foamGrad)' : 'url(#cremaGrad)'}
                opacity="0.95"
              />
            )}

            {/* 6. Toppings Overlay */}
            {topping === 'cinnamon' && (
              <g opacity="0.85">
                {[...Array(24)].map((_, i) => (
                  <circle
                    key={i}
                    cx={50 + (i * 17) % (sizeDims.cupWidthTop - 40)}
                    cy={55 + ((i * 11) % 12)}
                    r={1.2}
                    fill="#78350f"
                  />
                ))}
              </g>
            )}

            {topping === 'cocoa-dust' && (
              <g opacity="0.9">
                {[...Array(30)].map((_, i) => (
                  <circle
                    key={i}
                    cx={45 + (i * 13) % (sizeDims.cupWidthTop - 30)}
                    cy={54 + ((i * 9) % 14)}
                    r={1.4}
                    fill="#3f1d0b"
                  />
                ))}
              </g>
            )}

            {topping === 'caramel-drizzle' && (
              <path
                d={`
                  M 45 60 Q 60 52 80 62 T 115 54 T 150 63 T 185 55
                  M 55 64 Q 80 56 105 65 T 140 56 T 175 64
                `}
                fill="none"
                stroke="#c9782c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {topping === 'chocolate-drizzle' && (
              <path
                d={`
                  M 48 58 Q 70 50 95 62 T 130 53 T 165 62 T 190 56
                  M 60 63 Q 85 55 110 65 T 145 56 T 180 64
                `}
                fill="none"
                stroke="#37180d"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Glass / Ceramic Highlights on top of liquid */}
          <path
            d={`
              M 32 52
              L ${32 + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 16}
              L ${32 + sizeDims.cupWidthBottom + (sizeDims.cupWidthTop - sizeDims.cupWidthBottom) / 2} ${sizeDims.cupHeight + 16}
              L ${30 + sizeDims.cupWidthTop - 2} 52
              Z
            `}
            fill={isIced ? 'url(#glassReflection)' : 'url(#ceramicSheen)'}
            pointerEvents="none"
          />

          {/* Cup Rim Oval */}
          <ellipse
            cx={30 + sizeDims.cupWidthTop / 2}
            cy={52}
            rx={sizeDims.cupWidthTop / 2}
            ry={12}
            fill="none"
            stroke={isIced ? 'rgba(255,255,255,0.7)' : '#f0b86e'}
            strokeWidth="2.5"
          />

          {/* Cup Top View: Latte Art if hot and microfoam */}
          {!isIced && topping !== 'whipped-cream' && latteArt !== 'none' && (
            <g
              transform={`translate(${30 + sizeDims.cupWidthTop / 2 - 25}, 44) scale(0.65)`}
              pointerEvents="none"
            >
              {latteArt === 'heart' && (
                <path
                  d="M 38 15 C 38 8, 25 2, 15 12 C 4 2, -9 8, -9 15 C -9 28, 15 48, 15 48 C 15 48, 38 28, 38 15 Z"
                  fill="#ffffff"
                  stroke="#ecd3b2"
                  strokeWidth="2"
                  opacity="0.9"
                  transform="translate(24, 0)"
                />
              )}
              {latteArt === 'rosette' && (
                <g fill="#ffffff" opacity="0.9" stroke="#ecd3b2" strokeWidth="1.2">
                  <path d="M 38 3 C 25 -3, 20 6, 38 12 C 55 6, 50 -3, 38 3 Z" />
                  <path d="M 38 12 C 20 6, 15 17, 38 23 C 60 17, 55 6, 38 12 Z" />
                  <path d="M 38 23 C 18 19, 14 30, 38 36 C 62 30, 58 19, 38 23 Z" />
                  <line x1="38" y1="0" x2="38" y2="45" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
              {latteArt === 'tulip' && (
                <g fill="#ffffff" opacity="0.9" stroke="#ecd3b2" strokeWidth="1.5">
                  <path d="M 38 5 C 28 0, 24 10, 38 15 C 52 10, 48 0, 38 5 Z" />
                  <path d="M 38 16 C 24 10, 18 22, 38 28 C 58 22, 52 10, 38 16 Z" />
                  <path d="M 38 29 C 20 23, 14 37, 38 44 C 62 37, 56 23, 38 29 Z" />
                </g>
              )}
              {latteArt === 'swan' && (
                <g fill="#ffffff" opacity="0.9" stroke="#ecd3b2" strokeWidth="1.5">
                  <path d="M 25 15 C 20 5, 35 2, 40 10 C 45 18, 38 32, 28 38 C 45 32, 55 25, 58 18 C 52 28, 45 42, 25 45 Z" />
                  <path d="M 22 10 C 18 6, 12 12, 16 16 Z" />
                </g>
              )}
            </g>
          )}

          {/* Googles Cafe Badge on Cup Front */}
          <g transform={`translate(${30 + sizeDims.cupWidthTop / 2}, ${sizeDims.cupHeight * 0.58})`}>
            <circle cx="0" cy="0" r="22" fill="#140b07" stroke="rgba(212, 163, 115, 0.4)" strokeWidth="1.5" />
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fill="#e79948"
              fontSize="12"
              fontWeight="bold"
              fontFamily="Playfair Display, serif"
            >
              G
            </text>
            <text
              x="0"
              y="8"
              textAnchor="middle"
              fill="#d4a373"
              fontSize="7"
              fontWeight="600"
              letterSpacing="0.08em"
            >
              CAFE
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Layer Breakdown Legend */}
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
          maxWidth: 360
        }}
      >
        <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ffb26b' }}>
          ☕ {shots}x {base}
        </span>
        {milk !== 'none' && (
          <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f5ecd5' }}>
            🥛 {milk.toUpperCase()} MILK
          </span>
        )}
        {syrup !== 'none' && syrupPumps > 0 && (
          <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f3c274' }}>
            🍯 {syrupPumps}p {syrup.toUpperCase()}
          </span>
        )}
        {topping !== 'none' && (
          <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#e5d0b8' }}>
            ✨ {topping.replace('-', ' ').toUpperCase()}
          </span>
        )}
        {latteArt !== 'none' && !isIced && (
          <span className="glass-pill" style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#ffd59e' }}>
            🎨 {latteArt.toUpperCase()} ART
          </span>
        )}
      </div>

      <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        💡 Tap cup to test sound & barista steam
      </div>
    </div>
  );
}
