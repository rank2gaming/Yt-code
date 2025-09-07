import React, { useState, useEffect } from 'react';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';
import { StoreIcon, FacebookIcon, TwitterIcon, InstagramIcon, WhatsappIcon } from './icons';

interface FooterLink {
    text: string;
    url: string;
}

interface FooterColumn {
    title: string;
    links: { [key: string]: FooterLink };
}

interface FooterData {
    contact: {
        brandName: string;
        phone: string;
        address: string;
        email: string;
    };
    socials: {
        facebook: string;
        twitter: string;
        instagram: string;
        whatsapp: string;
    };
    columns: {
        [key: string]: FooterColumn;
    };
    bottomBar: {
        copyright: string;
        paymentText: string;
        paymentIcons: { [key: string]: { name: string; iconUrl: string } };
    };
}

const SocialIcon: React.FC<{ name: string, className?: string }> = ({ name, className }) => {
    switch(name.toLowerCase()) {
        case 'facebook': return <FacebookIcon className={className} />;
        case 'twitter': return <TwitterIcon className={className} />;
        case 'instagram': return <InstagramIcon className={className} />;
        case 'whatsapp': return <WhatsappIcon className={className} />;
        default: return null;
    }
}


const Footer: React.FC = () => {
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        const footerRef = ref(db, 'footer/');
        const unsubscribe = onValue(footerRef, (snapshot) => {
            if (snapshot.exists()) {
                setFooterData(snapshot.val());
            }
        });
        return () => unsubscribe();
    }, []);

    if (!footerData) {
        return null; // Don't render footer if no data
    }
    
    const { contact, socials, columns, bottomBar } = footerData;

    return (
        <footer className="bg-zinc-900 text-gray-300 p-4 mt-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {/* Contact Column */}
                <div className="col-span-2 md:col-span-1">
                    <h3 className="font-bold text-lg mb-4 text-white">{contact?.brandName || 'YBT Store'}</h3>
                    <div className="flex space-x-4 mb-4">
                        {socials && Object.entries(socials).map(([key, url]) => (
                             <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white" aria-label={key}>
                                <SocialIcon name={key} className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <div className="text-sm space-y-2">
                        <p>Call us 24/7</p>
                        <p className="font-semibold text-white">{contact?.phone}</p>
                        <p>{contact?.address}</p>
                        <a href={`mailto:${contact?.email}`} className="hover:underline">{contact?.email}</a>
                    </div>
                </div>

                {/* Link Columns */}
                {columns && Object.values(columns).map((col) => (
                    <div key={col.title}>
                        <h4 className="font-semibold mb-3 text-white">{col.title}</h4>
                        <ul className="space-y-2 text-sm">
                            {col.links && Object.values(col.links).map((link) => (
                                <li key={link.text}>
                                    <a href={link.url} className="hover:text-white transition-colors">{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <hr className="border-gray-700 my-6" />
            
            <div className="flex flex-col md:flex-row justify-between items-center text-center text-xs space-y-4 md:space-y-0">
                <p>{bottomBar?.copyright}</p>
                <div className="flex items-center space-x-2">
                    <span>{bottomBar?.paymentText}</span>
                    <div className="flex items-center space-x-2">
                        {bottomBar?.paymentIcons && Object.values(bottomBar.paymentIcons).map(icon => (
                            <img key={icon.name} src={icon.iconUrl} alt={icon.name} className="h-6 bg-white rounded p-1"/>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;