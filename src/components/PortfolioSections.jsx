import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Gamepad2, Code2, Box, Github, Linkedin, MapPin, GraduationCap } from 'lucide-react';
import { LINKEDIN_URL } from '../i18n';

function SectionHeading({ index, title, subtitle }) {
  return <header className="portfolio-section-heading"><span className="portfolio-index">{index}</span><div><h2 className="section-title">{title}</h2><p className="section-subtitle">{subtitle}</p></div></header>;
}

export function AboutSection() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  return <section id="about" className="portfolio-section">
    <SectionHeading index="01" title={t('about_title')} subtitle={t('about_subtitle')} />
    <div className="about-editorial">
      <div className="about-intro"><h3>{tr ? 'Oyun hissinden, günlük kullandığın yazılımlara.' : 'From the feel of a game to the tools you use every day.'}</h3><a href="#contact" className="portfolio-text-link">{tr ? 'Birlikte bir şeyler üretelim' : 'Let’s build something together'} <ArrowUpRight size={18}/></a></div>
      <div className="about-narrative"><p>{tr ? 'İstanbul Kültür Üniversitesi’nde Dijital Oyun Tasarımı okuyorum. Unity ve C# ile oyunlar; Electron, TypeScript ve Swift ile masaüstü uygulamaları geliştiriyorum.' : 'I study Digital Game Design at Istanbul Kultur University. I build games with Unity and C#, and desktop applications with Electron, TypeScript and Swift.'}</p><p>{tr ? 'Karakter kontrollerinden ürün arayüzlerine kadar, bir şeyin nasıl çalıştığı kadar nasıl hissettirdiğini de önemsiyorum. Projelerimi @unitybtw altında açık kaynak olarak paylaşıyorum.' : 'From character controllers to product interfaces, I care about how things feel as much as how they work. I share my open-source projects as @unitybtw.'}</p></div>
    </div>
    <dl className="about-facts">
      <div><dt><GraduationCap size={17}/>{t('about_stat_1')}</dt><dd>{t('about_stat_1_val')}</dd></div>
      <div><dt><Code2 size={17}/>{t('about_stat_2')}</dt><dd>{t('about_stat_2_val')}</dd></div>
      <div><dt><MapPin size={17}/>{tr ? 'Konum & çalışma' : 'Location & work'}</dt><dd>İstanbul · Remote / Hybrid</dd></div>
    </dl>
  </section>;
}

export function SkillsSection() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const groups = [
    {icon:Gamepad2, title:t('skill_cat_engines'), items:['Unity 3D','C# gameplay','URP / HDRP'],desc:t('skill_unity_desc')},
    {icon:Code2, title:t('skill_cat_languages'), items:['TypeScript','Electron','React'],desc:t('skill_languages_desc')},
    {icon:Box, title:t('skill_cat_tools'), items:['Blender','Git & GitHub','Vite / Node.js'],desc:t('skill_blender_desc')},
  ];
  return <section id="skills" className="portfolio-section"><SectionHeading index="02" title={t('skills_title')} subtitle={tr ? 'Fikirden çalışan ürüne, kullandığım araçlar.' : 'The tools I use to take an idea into a working product.'}/>
    <div className="capability-grid">{groups.map((group,index)=>{const {icon:Icon,title,items,desc}=group; return <article className="capability" key={title}><div className="capability-top"><Icon size={25} strokeWidth={1.5}/><span>0{index+1}</span></div><h3>{title}</h3><p>{desc}</p><ul>{items.map(item=><li key={item}>{item}</li>)}</ul></article>})}</div>
  </section>;
}

export function ProjectsSection() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  const projects=[
    {id:'masks',title:t('games.m_title'),description:t('games.m_desc'),type:tr?'Yayınlanmış oyun':'Released game',stack:'Unity · C# · URP · Blender',url:'https://unitybtw.itch.io/legend-of-the-three-masks',link:tr?'Oyunu keşfet':'Explore the game',image:`${import.meta.env.BASE_URL}assets/masks.webp`},
    {id:'signal',title:t('games.signal_title'),description:t('games.signal_desc'),type:tr?'macOS uygulaması · Açık kaynak':'macOS application · Open source',stack:'Swift · SwiftUI · Core Audio',url:'https://github.com/unitybtw/Signal-macOS',link:tr?'Kaynak kodu':'View source',icon:Code2},
    {id:'aether',title:t('games.aether_title'),description:t('games.aether_desc'),type:tr?'Masaüstü aracı · Açık kaynak':'Desktop utility · Open source',stack:'Swift · Vision API · AppKit',url:'https://github.com/unitybtw/aether-command',link:tr?'Kaynak kodu':'View source',icon:Box},
  ];
  return <section id="other-projects" className="portfolio-section"><SectionHeading index="03" title={t('archives_title')} subtitle={t('archives_subtitle')}/><div className="selected-work">{projects.map(({id,title,description,type,stack,url,link,image,icon:Icon},index)=><article key={id} className={`work-row ${image?'work-row-featured':''}`}>
    {image && <a href={url} target="_blank" rel="noopener noreferrer" className="work-image-link" aria-label={title}><img src={image} alt={title} loading="lazy" width="1376" height="768"/></a>}
    <div className="work-copy"><div className="work-meta"><span>0{index+1}</span><span>{type}</span>{Icon && <Icon size={18}/>}</div><h3>{title}</h3><p>{description}</p><div className="work-bottom"><span className="work-stack">{stack}</span><a href={url} target="_blank" rel="noopener noreferrer" className="portfolio-text-link">{link}<ArrowUpRight size={18}/></a></div></div>
  </article>)}</div></section>;
}

export function ContactIntro() {
  const { t, i18n } = useTranslation();
  const tr = i18n.language.startsWith('tr');
  return <div className="contact-info contact-editorial"><span className="portfolio-eyebrow">{tr ? 'SIRADAKİ PROJE' : 'THE NEXT PROJECT'}</span><h2 className="section-title">{tr ? 'Güzel bir fikirle başlayalım.' : 'Good things start with a conversation.'}</h2><p className="contact-subtitle">{t('footer_subtitle')}</p><a className="contact-email" href="mailto:sgoktug34@gmail.com">sgoktug34@gmail.com <ArrowUpRight size={22}/></a><div className="contact-social-links"><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"><Linkedin size={17}/>LinkedIn</a><a href="https://github.com/unitybtw" target="_blank" rel="noopener noreferrer"><Github size={17}/>GitHub</a><a href="https://unitybtw.itch.io" target="_blank" rel="noopener noreferrer"><Gamepad2 size={17}/>Itch.io</a></div><div className="contact-availability"><span className="availability-dot"/><span>{t('about_stat_4_val')}<small>İstanbul · Remote / Hybrid</small></span></div></div>;
}
