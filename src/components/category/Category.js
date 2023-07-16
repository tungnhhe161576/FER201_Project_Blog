import "./category.css"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { GrFormPrevious } from "react-icons/gr"
import { MdNavigateNext } from "react-icons/md"



export default function Category( {categories} ) {

    const SampleNextArrow = (props) => {
        const { onClick } = props
        return (
            <div className='control-btn' onClick={onClick}>
                <button className='next'>
                    <MdNavigateNext className='icon' />
                </button>
            </div>
        )
    }

    const SamplePrevArrow = (props) => {
        const { onClick } = props
        return (
            <div className='control-btn' onClick={onClick}>
                <button className='prev'>
                    <GrFormPrevious className='icon' />
                </button>
            </div>
        )

    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 100,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
        autoplay: true,
        autoplaySpeed: 3000
    }

    return (
        <>
            <section className='category'>
                <div className='content d-none d-sm-block'>
                    <Slider {...settings}>
                        {
                            categories.map((item) => (
                                <div className='boxs' key={item.id}>
                                    <div className='box' key='{item.id}'>
                                        <img src={item.cover} alt='cover' />
                                        <div className='overlay'>
                                            <h4>{item.category}</h4>
                                            <p>{item.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </Slider>
                </div>
                <div className='content d-block d-sm-none'>
                    <div className="jumbotron jumbotron-fluid">
                        <div className="container">
                            <h1 className="display-4">My Website</h1>
                            <p className="lead">FER201m Assignment</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}