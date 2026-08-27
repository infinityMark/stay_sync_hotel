// component & layout
import NavBarInit from '../../layouts/ClientHeader';
import FooterInit from '../../layouts/ClientFooter';
import ImgExhibition from '../../components/photoExhibition/exhibition';
// interface
import type { ExhibitionSlide } from '../../components/photoExhibition/exhibition';
// image source
import hotelimage from '../../assets/hotel_overall/hotel.png';

const photolists: ExhibitionSlide[] = [
    {
        image: hotelimage,
        alt: 'hotel overall',
        eyebrow: 'hotel overalls',
        title: 'enjoy chill life',
    },
];

const Home = () => {
    return (
        <div>
            <NavBarInit />
            <div className="content">
                <ImgExhibition slides={photolists} aspectRatio="16/9" />
            </div>
            <FooterInit />
        </div>
    );
};

export default Home;
