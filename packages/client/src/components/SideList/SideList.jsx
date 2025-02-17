import * as React from 'react';
import './SideList.scss';

const SideList = ({ title, items = [], limit, seeMoreType, renderItem }) => {
    const [visibleItemsCount, setVisibleItemsCount] = React.useState(limit);
    const [showMore, setShowMore] = React.useState(false);

    const handleSeeMore = () => {
        if (seeMoreType === 'expand') {
            if (!showMore) {
                setVisibleItemsCount((prevCount) => prevCount + limit);
                setShowMore(true);
            } else if (showMore) {
                setVisibleItemsCount((prevCount) => prevCount - limit);
                setShowMore(false);
            }
        }
    };

    return (
        <>
            {!items || items.length <= 0 &&
                <div>Erreur</div>
            }

            {items && items.length > 0 &&
                <div className='side-list-container'>
                    <h3>{title}</h3>
                    {/* {content} */}
                    {items.slice(0, visibleItemsCount).map((item) => (
                        <div key={item.id} className='list-item'>
                            {renderItem(item)}
                        </div>
                    ))}

                    <button className="see-more-button" onClick={handleSeeMore}>
                        {showMore
                            ? 'Voir moins'
                            : 'Voir plus'
                        }
                    </button>

                </div>
            }


        </>
    )
}

export default SideList;