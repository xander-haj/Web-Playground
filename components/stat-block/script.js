export default function init(previewElement) {

  const statBlocks = previewElement.querySelectorAll('.stat-block');
  if (!statBlocks.length) return;

  const initialValues = Array.from(statBlocks).map(block => {
    return {
      metric: block.querySelector('.stat-metric').textContent,
      change: block.querySelector('.stat-change > span').textContent
    };
  });
  
  const updateStats = () => {
    statBlocks.forEach((block, index) => {
      const metricEl = block.querySelector('.stat-metric');
      const changeEl = block.querySelector('.stat-change > span');

      if (metricEl.textContent === initialValues[index].metric) {

        const currentMetric = parseFloat(metricEl.textContent.replace(/[^0-9.]/g, ''));
        const newMetric = currentMetric * (1 + (Math.random() * 0.1 - 0.05));
        
        if (metricEl.textContent.includes('$')) {
            metricEl.textContent = `$${newMetric.toFixed(2)}`;
        } else if (metricEl.textContent.includes('%')) {
            metricEl.textContent = `${newMetric.toFixed(1)}%`;
        } else {
            metricEl.textContent = Math.round(newMetric).toLocaleString();
        }
        changeEl.textContent = `Updated at ${new Date().toLocaleTimeString()}`;
      } else {

        metricEl.textContent = initialValues[index].metric;
        changeEl.textContent = initialValues[index].change;
      }
    });
  };

  const intervalId = setInterval(updateStats, 3000);


}
