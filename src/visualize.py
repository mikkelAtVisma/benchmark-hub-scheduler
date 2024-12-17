import json
import matplotlib.pyplot as plt
from datetime import datetime
import sys
from typing import Dict, List, Tuple

def read_result_file(file_path: str) -> Dict:
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data

def extract_score_data(data: Dict) -> Tuple[List[datetime], List[int], List[int], Dict[str, List[int]], Dict[str, int]]:
    timestamps = []
    hard_scores = []
    soft_scores = []
    component_scores: Dict[str, List[int]] = {}
    
    # Extract data from each stat group
    for stat_group in data['statGroups']:
        timestamp = datetime.fromtimestamp(stat_group['timestamp'] / 1000)  # Convert to seconds
        timestamps.append(timestamp)
        hard_scores.append(stat_group['scoreHard'])
        soft_scores.append(stat_group['scoreSoft'])
        
        # Track individual component scores
        for comp in stat_group['hardScoreComposition']:
            if comp['score'] != 0:  # Only track non-zero scores
                if comp['componentName'] not in component_scores:
                    component_scores[comp['componentName']] = []
                component_scores[comp['componentName']].append(comp['score'])
    
    # Get final scores from the last stat group entry
    final_stat_group = data['statGroups'][-1]
    final_scores = {
        'hard': final_stat_group['scoreHard'],
        'soft': final_stat_group['scoreSoft'],
        'components': {
            comp['componentName']: comp['score'] 
            for comp in final_stat_group['hardScoreComposition'] + final_stat_group['softScoreComposition']
            if comp['score'] != 0
        }
    }
    
    return timestamps, hard_scores, soft_scores, component_scores, final_scores

def plot_scores(file_path: str):
    # Read and process data
    data = read_result_file(file_path)
    timestamps, hard_scores, soft_scores, component_scores, final_scores = extract_score_data(data)
    
    # Create figure with subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10), height_ratios=[1, 2])
    fig.suptitle(f'Score Evolution Over Time\nFile: {data["name"]}', fontsize=14)
    
    # Plot total scores
    ax1.plot(timestamps, hard_scores, label='Hard Score', color='red', marker='o')
    ax1.plot(timestamps, soft_scores, label='Soft Score', color='blue', marker='o')
    ax1.grid(True, linestyle='--', alpha=0.7)
    ax1.legend()
    ax1.set_ylabel('Score Value')
    ax1.set_title('Total Scores')
    
    # Plot component scores
    for component_name, scores in component_scores.items():
        display_name = component_name.replace('-monitor', '').replace('-', ' ').title()
        ax2.plot(timestamps, scores, label=display_name, marker='.')
    
    ax2.grid(True, linestyle='--', alpha=0.7)
    ax2.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    ax2.set_ylabel('Component Score Value')
    ax2.set_xlabel('Time')
    ax2.set_title('Individual Component Scores')
    
    # Display final scores
    final_score_text = f"Final Hard Score: {final_scores['hard']}\nFinal Soft Score: {final_scores['soft']}\n"
    final_score_text += "\n".join([f"{name}: {score}" for name, score in final_scores['components'].items()])
    ax2.text(0.95, 0.01, final_score_text, verticalalignment='bottom', horizontalalignment='right',
             transform=ax2.transAxes, color='black', fontsize=10, bbox=dict(facecolor='white', alpha=0.5))
    
    # Rotate x-axis labels for better readability
    plt.setp(ax1.get_xticklabels(), rotation=45)
    plt.setp(ax2.get_xticklabels(), rotation=45)
    
    # Adjust layout to prevent label cutoff
    plt.tight_layout()
    
    # Save the plot
    output_file = f"score_visualization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    plt.savefig(output_file, bbox_inches='tight', dpi=300)
    print(f"Visualization saved as: {output_file}")
    
    # Show the plot
    plt.show()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python visualize_scores.py <path_to_result_file>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    plot_scores(file_path)